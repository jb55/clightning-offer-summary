#!/usr/bin/env node
const Plugin = require('clightningjs');
const plugin = new Plugin();

function invoice_matches(invoice, offerid, matcher)
{
	if (offerid && invoice.local_offer_id === offerid) {
		return true
	}

	if (matcher) {
		return matcher.test(invoice.description)
	}

	return false
}

async function summarize_offer(params) {
	const offerid = params.offerid || params[0]
	const limit = params.limit || params[1]
	const description = params.description || params[2]
	let matcher = null

	if (description) {
		matcher = new RegExp(description)
	}

	if (!offerid && !description)
		return missing_param("offerid")

	const {invoices} = await plugin.rpc.call('listinvoices')
	
	let total_msatoshi = 0
	let paid_invoices = []
	let top_donors = []

	for (const invoice of invoices) {
		if (invoice.status === 'paid' && invoice_matches(invoice, offerid, matcher)) {
			total_msatoshi += invoice.msatoshi_received || 0

			const whitelisted = whitelisted_invoice(invoice)
			process_top_donors(top_donors, whitelisted, limit)

			if (limit && (paid_invoices.length + 1 > limit)) {
				// pop off older notes
				paid_invoices.pop()
			}

			paid_invoices.unshift(whitelisted)
		}
	}

	if (limit)
		top_donors = top_donors.slice(0, limit)

	return {total_msatoshi, paid_invoices, top_donors}
}

function whitelisted_invoice({payer_note, paid_at, msatoshi_received, description}) {

	return {payer_note, paid_at, msatoshi: msatoshi_received, description}
}

function process_top_donors(top_donors, invoice, limit)
{
	for (let i = 0; i < top_donors.length; i++) {
		const donor = top_donors[i]
		if (invoice.msatoshi >= donor.msatoshi) {
			top_donors.splice(i, 0, invoice)
			return
		}
	}

	top_donors.push(invoice)
}

function missing_param(name) {
	return {
		code: -32602,
		message: "missing required parameter: " + name
	}
}

// (name, callback, usage, description, longDescription)
plugin.addMethod('offer-summary', summarize_offer, '<offerid> [limit] [description (regex that matches description)]', 'Summarize offers, listing totals and payer notes');
plugin.start();

