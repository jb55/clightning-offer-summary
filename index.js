#!/usr/bin/env node
const Plugin = require('clightningjs');
const plugin = new Plugin();

async function summarize_offer(params) {
	const offerid = params.offerid || params[0]
	const limit = params.limit || params[1]
	if (!offerid)
		return missing_param("offerid")

	const {invoices} = await plugin.rpc.call('listinvoices')
	
	let total_msatoshi = 0
	let paid_invoices = []
	let top_donors = []

	for (const invoice of invoices) {
		if (invoice.local_offer_id === offerid && invoice.status === 'paid') {
			total_msatoshi += invoice.msatoshi || 0

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

function whitelisted_invoice({payer_note, paid_at, msatoshi}) {
	return {payer_note, paid_at, msatoshi}
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
plugin.addMethod('offer-summary', summarize_offer, 'offerid', 'Summarize offers, listing totals and payer notes');
plugin.start();

