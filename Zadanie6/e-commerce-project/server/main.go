package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Product represents a product in the store
type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Image       string  `json:"image"`
}

// OrderItem represents an item in an order
type OrderItem struct {
	ProductID int     `json:"productId"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

// CustomerInfo contains customer details for an order
type CustomerInfo struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Address string `json:"address"`
	City    string `json:"city"`
	Zip     string `json:"zip"`
}

// Order represents a customer order
type Order struct {
	ID           int          `json:"id"`
	CustomerInfo CustomerInfo `json:"customerInfo"`
	Items        []OrderItem  `json:"items"`
	TotalAmount  float64      `json:"totalAmount"`
	OrderDate    time.Time    `json:"orderDate"`
}

// Global state (in a real app, this would be in a database)
var products []Product
var orders []Order
var nextOrderID = 1

func init() {
	// Initialize with sample products
	products = []Product{
		{
			ID:          1,
			Name:        "Laptop",
			Description: "High-performance laptop with 16GB RAM and 512GB SSD",
			Price:       999.99,
			Image:       "https://via.placeholder.com/300x200?text=Laptop",
		},
		{
			ID:          2,
			Name:        "Smartphone",
			Description: "Latest model with triple camera and 128GB storage",
			Price:       699.99,
			Image:       "https://via.placeholder.com/300x200?text=Smartphone",
		},
		{
			ID:          3,
			Name:        "Wireless Headphones",
			Description: "Noise-cancelling headphones with 30 hours battery life",
			Price:       249.99,
			Image:       "https://via.placeholder.com/300x200?text=Headphones",
		},
		{
			ID:          4,
			Name:        "Smart Watch",
			Description: "Fitness tracking, heart rate monitoring, and notifications",
			Price:       199.99,
			Image:       "https://via.placeholder.com/300x200?text=SmartWatch",
		},
		{
			ID:          5,
			Name:        "Tablet",
			Description: "10.2-inch display, 64GB storage, perfect for entertainment",
			Price:       329.99,
			Image:       "https://via.placeholder.com/300x200?text=Tablet",
		},
		{
			ID:          6,
			Name:        "Wireless Earbuds",
			Description: "True wireless earbuds with charging case and water resistance",
			Price:       129.99,
			Image:       "https://via.placeholder.com/300x200?text=Earbuds",
		},
	}
}

func getProducts(w http.ResponseWriter, r *http.Request) {
	// Simulate network delay
	time.Sleep(300 * time.Millisecond)
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
	
	log.Println("Products fetched")
}

func getProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}
	
	for _, product := range products {
		if product.ID == id {
			json.NewEncoder(w).Encode(product)
			log.Printf("Product fetched: %d", id)
			return
		}
	}
	
	http.Error(w, "Product not found", http.StatusNotFound)
}

func createOrder(w http.ResponseWriter, r *http.Request) {
	// Simulate processing delay
	time.Sleep(500 * time.Millisecond)
	
	w.Header().Set("Content-Type", "application/json")
	
	var orderRequest Order
	err := json.NewDecoder(r.Body).Decode(&orderRequest)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		log.Printf("Error decoding request: %v", err)
		return
	}
	
	// Validate the order
	if len(orderRequest.Items) == 0 {
		http.Error(w, "Order must contain items", http.StatusBadRequest)
		return
	}
	
	// Create a new order
	newOrder := Order{
		ID:           nextOrderID,
		CustomerInfo: orderRequest.CustomerInfo,
		Items:        orderRequest.Items,
		TotalAmount:  orderRequest.TotalAmount,
		OrderDate:    time.Now(),
	}
	
	// In a real app, we would validate the products, check inventory, etc.
	
	// Add the order to our "database"
	orders = append(orders, newOrder)
	nextOrderID++
	
	// Return the created order
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newOrder)
	
	log.Printf("Order created: #%d for %s, total: $%.2f", 
		newOrder.ID, 
		newOrder.CustomerInfo.Name,
		newOrder.TotalAmount)
}

func getOrders(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
	log.Println("Orders fetched")
}

func main() {
	// Create a new router
	router := mux.NewRouter()
	
	// API routes
	router.HandleFunc("/api/products", getProducts).Methods("GET")
	router.HandleFunc("/api/products/{id}", getProduct).Methods("GET")
	router.HandleFunc("/api/orders", createOrder).Methods("POST")
	router.HandleFunc("/api/orders", getOrders).Methods("GET")
	
	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})
	
	// Wrap the router with CORS middleware
	handler := c.Handler(router)
	
	// Start the server
	port := 8080
	fmt.Printf("Starting server on port %d...\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), handler))
}
