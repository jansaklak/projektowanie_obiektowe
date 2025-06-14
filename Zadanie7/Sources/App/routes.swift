import Vapor

func routes(_ app: Application) throws {
    app.get { req async throws -> View in
        try await req.view.render("index")
    }
    
    let productController = ProductController()
    app.get("products", use: productController.index)
    app.get("products", "create", use: productController.create)
    app.post("products", use: productController.store)
    app.get("products", ":id", use: productController.show)
    app.get("products", ":id", "edit", use: productController.edit)
    app.post("products", ":id", "update", use: productController.update)
    app.post("products", ":id", "delete", use: productController.delete)
    
    let categoryController = CategoryController()
    app.get("categories", use: categoryController.index)
    app.get("categories", "create", use: categoryController.create)
    app.post("categories", use: categoryController.store)
    app.get("categories", ":id", use: categoryController.show)
    app.get("categories", ":id", "edit", use: categoryController.edit)
    app.post("categories", ":id", "update", use: categoryController.update)
    app.post("categories", ":id", "delete", use: categoryController.delete)
}
