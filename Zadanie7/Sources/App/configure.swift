import Vapor
import Fluent
import FluentPostgresDriver
import Leaf

public func configure(_ app: Application) throws {
    let postgresConfig = SQLPostgresConfiguration(
        hostname: Environment.get("DATABASE_HOST") ?? "localhost",
        port: Environment.get("DATABASE_PORT").flatMap(Int.init) ?? SQLPostgresConfiguration.ianaPortNumber,
        username: Environment.get("DATABASE_USERNAME") ?? "vapor_username",
        password: Environment.get("DATABASE_PASSWORD") ?? "vapor_password",
        database: Environment.get("DATABASE_NAME") ?? "vapor_db",
        tls: .disable
    )
    app.databases.use(.postgres(configuration: postgresConfig), as: .psql)
    
    app.migrations.add(CreateCategory())
    app.migrations.add(CreateProduct())
    
    app.views.use(.leaf)
    app.leaf.cache.isEnabled = app.environment.isRelease
    
    app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))
    
    try routes(app)
}
