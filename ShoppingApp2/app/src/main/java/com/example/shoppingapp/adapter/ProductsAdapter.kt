package com.example.shoppingapp.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.shoppingapp.R
import com.example.shoppingapp.models.Product

class ProductsAdapter(
    private val products: List<Product>,
    private val onAddToCart: (Product) -> Unit
) : RecyclerView.Adapter<ProductsAdapter.ProductViewHolder>() {

    class ProductViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val nameText: TextView = view.findViewById(R.id.text_product_name)
        val descriptionText: TextView = view.findViewById(R.id.text_product_description)
        val priceText: TextView = view.findViewById(R.id.text_product_price)
        val addToCartButton: Button = view.findViewById(R.id.button_add_to_cart)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_product, parent, false)
        return ProductViewHolder(view)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val product = products[position]
        holder.nameText.text = product.name
        holder.descriptionText.text = product.description
        holder.priceText.text = "${product.price} zł"

        holder.addToCartButton.setOnClickListener {
            onAddToCart(product)
        }
    }

    override fun getItemCount() = products.size
}