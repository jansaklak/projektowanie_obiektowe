// swift-tools-version:5.10
import PackageDescription

let package = Package(
    name: "VaporCRUDApp",
    platforms: [
        .macOS(.v12)
    ],
    dependencies: [
        .package(url: "https://github.com/vapor/vapor.git", from: "4.101.0"),
        .package(url: "https://github.com/vapor/fluent.git", from: "4.11.0"),
        .package(url: "https://github.com/vapor/fluent-postgres-driver.git", from: "2.9.2"),
        .package(url: "https://github.com/vapor/leaf.git", from: "4.4.0")
    ],
    targets: [
        .target(
            name: "App",
            dependencies: [
                .product(name: "Vapor", package: "vapor"),
                .product(name: "Fluent", package: "fluent"),
                .product(name: "FluentPostgresDriver", package: "fluent-postgres-driver"),
                .product(name: "Leaf", package: "leaf")
            ],
            swiftSettings: [
                .unsafeFlags(["-cross-module-optimization"], .when(configuration: .release))
            ]
        ),
        .executableTarget(
            name: "Run",
            dependencies: [.target(name: "App")]
        ),
        .testTarget(
            name: "AppTests",
            dependencies: [.target(name: "App")]
        )
    ]
)
