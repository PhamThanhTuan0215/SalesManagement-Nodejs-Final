const DetailsOrder = require('../models/DetailsOrder')
const createBill = require('../billOrder/createBill')

module.exports.dashboard =  (req, res) => {
    let justPaid = ''
    const order = req.session.user.recentOrder || undefined

    if(order) {
        justPaid = 'true'
        delete req.session.user.recentOrder

        DetailsOrder.find({ orderId: order._id })
        .then(details => {

            createBill(req.session.user.fullname, order, details) // in bill to pdf file

            return res.render('Dashboard', {user: req.session.user, justPaid, order, detailsOrder: details})
        })
    }
    else {
        return res.render('Dashboard', {user: req.session.user, justPaid})
    }
}

module.exports.information = (req, res) => {
    const errorMessage = req.flash('errorMessage') || ''
    const successMessage = req.flash('successMessage') || ''

    res.render('Information', {user: req.session.user, errorMessage, successMessage})
}