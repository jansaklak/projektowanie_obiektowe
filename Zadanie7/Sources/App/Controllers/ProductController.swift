import Vapor
import Fluent
import Leaf

struct ProductController: RouteCollection {
    func boot(routes: RoutesBuilder) throws { }
    
    func index(req: Request) async throws -> View {
        let products = try await Product.query(on: req.db).with(\.$category).all()
        return try await req.view.render("products/index", ["products": products])
    }
    
    func create(req: Request) async throws -> View {
        let categories = try await Category.query(on: req.db).all()
        return try await req.view.render("products/create", ["categories": categories])
    }
    
    func store(req: Request) async throws -> Response {
        let productData = try req.content.decode(ProductForm.self)
        let product = Product(name: productData.name, price: productData.price, categoryID: productData.categoryID)
        try await product.save(on: req.db)
        return req.redirect(to: "/products")
    }
    
    func show(req: Request) async throws -> View {
        guard let idString = req.parameters.get("id"),
              let id = UUID(idString),
              let product = try await Product.query(on: req.db)
                                     .filter(\.$id == id)
                                     .with(\.$category)
                                     .first() else {
            throw Abort(.notFound)
        }
        return try await req.view.render("products/show", ["product": product])
    }
    
    func edit(req: Request) async throws -> View {
        guard let idString = req.parameters.get("id"),
              let id = UUID(idString),
              let product = try await Product.query(on: req.db)
                                     .filter(\.$id == id)
                                     .with(\.$category)
                                     .first() else {
            throw Abort(.notFound)
        }
        let categories = try await Category.query(on: req.db).all()
        struct Context: Content {
            let product: Product
            let categories: [Category]
        }
        let context = Context(product: product, categories: categories)
        return try await req.view.render("products/edit", context)
    }
    
    func update(req: Request) async throws -> Response {
        guard let product = try await Product.find(req.parameters.get("id"), on: req.db) else {
            throw Abort(.notFound)
        }
        let productData = try req.content.decode(ProductForm.self)
        product.name = productData.name
        product.price = productData.price
        product.$category.id = productData.categoryID
        try await product.save(on: req.db)
        return req.redirect(to: "/products")
    }
    
    func delete(req: Request) async throws -> Response {
        guard let product = try await Product.find(req.parameters.get("id"), on: req.db) else {
            throw Abort(.notFound)
        }
        try await product.delete(on: req.db)
        return req.redirect(to: "/products")
    }
}

struct ProductForm: Content {
    let name: String
    let price: Double
    let categoryID: UUID
}
