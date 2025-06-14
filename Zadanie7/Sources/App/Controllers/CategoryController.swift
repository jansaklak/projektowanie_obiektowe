import Vapor
import Fluent
import Leaf

struct CategoryController: RouteCollection {
    func boot(routes: RoutesBuilder) throws { }
    
    func index(req: Request) async throws -> View {
        let categories = try await Category.query(on: req.db).all()
        return try await req.view.render("categories/index", ["categories": categories])
    }
    
    func create(req: Request) async throws -> View {
        return try await req.view.render("categories/create")
    }
    
    func store(req: Request) async throws -> Response {
        let category = try req.content.decode(Category.self)
        try await category.save(on: req.db)
        return req.redirect(to: "/categories")
    }
    
    func show(req: Request) async throws -> View {
        guard let category = try await Category.find(req.parameters.get("id"), on: req.db) else {
            throw Abort(.notFound)
        }
        let products = try await category.$products.get(on: req.db)
        struct Context: Content {
            let category: Category
            let products: [Product]
        }
        let context = Context(category: category, products: products)
        return try await req.view.render("categories/show", context)
    }
    
    func edit(req: Request) async throws -> View {
        guard let category = try await Category.find(req.parameters.get("id"), on: req.db) else {
            throw Abort(.notFound)
        }
        return try await req.view.render("categories/edit", ["category": category])
    }
    
    func update(req: Request) async throws -> Response {
        guard let category = try await Category.find(req.parameters.get("id"), on: req.db) else {
            throw Abort(.notFound)
        }
        let updatedCategory = try req.content.decode(Category.self)
        category.name = updatedCategory.name
        try await category.save(on: req.db)
        return req.redirect(to: "/categories")
    }
    
    func delete(req: Request) async throws -> Response {
        guard let category = try await Category.find(req.parameters.get("id"), on: req.db) else {
            throw Abort(.notFound)
        }
        try await category.delete(on: req.db)
        return req.redirect(to: "/categories")
    }
}
