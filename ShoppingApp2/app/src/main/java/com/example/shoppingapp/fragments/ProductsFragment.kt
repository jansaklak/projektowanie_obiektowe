package com.example.shoppingapp.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.shoppingapp.R
import com.example.shoppingapp.adapters.ProductsAdapter
import com.example.shoppingapp.models.CartItem
import com.example.shoppingapp.models.Product
import io.realm.Realm
import java.util.*
import kotlin.collections.sumOf

class ProductsFragment : Fragment() {

    private lateinit var realm: Realm
    private lateinit var recyclerView: RecyclerView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_products, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        realm = Realm.getDefaultInstance()
        recyclerView = view.findViewById(R.id.recycler_products)

        setupRecyclerView()
        loadProducts()
    }

    private fun setupRecyclerView() {
        recyclerView.layoutManager = LinearLayoutManager(context)
    }

    private fun loadProducts() {
        val products = realm.where(Product::class.java).findAll()

        if (products.isEmpty()) {
            addSampleProducts()
            return
        }

        val adapter = ProductsAdapter(products) { product ->
            addToCart(product)
        }
        recyclerView.adapter = adapter
    }

    private fun addSampleProducts() {
        realm.executeTransaction { realm ->
            // Elektronika
            val product1 = realm.createObject(Product::class.java, UUID.randomUUID().toString())
            product1.name = "Smartphone Samsung"
            product1.description = "Najnowszy model z aparatem 108MP"
            product1.price = 2499.99
            product1.categoryId = "elektronika"

            val product2 = realm.createObject(Product::class.java, UUID.randomUUID().toString())
            product2.name = "Laptop Dell"
            product2.description = "Intel i7, 16GB RAM, 512GB SSD"
            product2.price = 3999.00
            product2.categoryId = "elektronika"

            // Książki
            val product3 = realm.createObject(Product::class.java, UUID.randomUUID().toString())
            product3.name = "Wiedźmin - Ostatnie życzenie"
            product3.description = "Andrzej Sapkowski"
            product3.price = 39.99
            product3.categoryId = "ksiazki"

            val product4 = realm.createObject(Product::class.java, UUID.randomUUID().toString())
            product4.name = "Programowanie w Kotlin"
            product4.description = "Kompletny przewodnik"
            product4.price = 89.99
            product4.categoryId = "ksiazki"

            // Odzież
            val product5 = realm.createObject(Product::class.java, UUID.randomUUID().toString())
            product5.name = "T-shirt Basic"
            product5.description = "100% bawełna, różne kolory"
            product5.price = 49.99
            product5.categoryId = "odziez"

            val product6 = realm.createObject(Product::class.java, UUID.randomUUID().toString())
            product6.name = "Jeans Slim Fit"
            product6.description = "Klasyczne spodnie jeansowe"
            product6.price = 149.99
            product6.categoryId = "odziez"
        }
        loadProducts()
    }

    private fun addToCart(product: Product) {
        realm.executeTransaction { realm ->
            // Sprawdź czy produkt już jest w koszyku
            val existingItem = realm.where(CartItem::class.java)
                .equalTo("productId", product.id)
                .findFirst()

            if (existingItem != null) {
                // Zwiększ ilość
                existingItem.quantity += 1
            } else {
                // Dodaj nowy item do koszyka
                val cartItem = realm.createObject(CartItem::class.java, UUID.randomUUID().toString())
                cartItem.productId = product.id
                cartItem.productName = product.name
                cartItem.price = product.price
                cartItem.quantity = 1
            }
        }

        Toast.makeText(context, "${product.name} dodano do koszyka", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroy() {
        super.onDestroy()
        realm.close()
    }
}