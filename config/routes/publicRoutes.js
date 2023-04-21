const publicRoutes = {
    "POST /account/" :"accountControllers.createAccount",
    "GET /accounts/" :"accountControllers.getAll",
    "GET /filter-account/" :"accountControllers.filterBy",
    "PUT /update-account/" :"accountControllers.updateAccount",
    "DELETE /delete-account/" :"accountControllers.deleteAccount"
}

module.exports = publicRoutes;