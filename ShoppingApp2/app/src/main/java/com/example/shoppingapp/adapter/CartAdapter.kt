package com.example.shoppingapp.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.shoppingapp.R
import com.example.shoppingapp.models.CartItem

class CartAdapter(
    private val cartItems: List<CartItem>,
    private val onQuantityChanged: (CartItem, Int) -> Unit,
    private val onRemoveItem: (CartItem) -> Unit
) : RecyclerView.Adapter<CartAdapter.CartViewHolder>() {

    class CartViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val nameText: TextView = view.findViewById(R.id.text_cart_product_name)
        val priceText: TextView = view.findViewById(R.id.text_cart_product_price)
        val quantityText: TextView = view.findViewById(R.id.text_cart_quantity)
        val totalText: TextView = view.findViewById(R.id.text_cart_total)
        val decreaseButton: Button = view.findViewById(R.id.button_decrease)
        val increaseButton: Button = view.findViewById(R.id.button_increase)
        val removeButton: Button = view.findViewById(R.id.button_remove)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CartViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_cart, parent, false)
        return CartViewHolder(view)
    }

    override fun onBindViewHolder(holder: CartViewHolder, position: Int) {
        val cartItem = cartItems[position]

        holder.nameText.text = cartItem.productName
        holder.priceText.text = "${cartItem.price} zł"
        holder.quantityText.text = cartItem.quantity.toString()
        holder.totalText.text = String.format("%.2f zł", cartItem.price * cartItem.quantity)

        holder.decreaseButton.setOnClickListener {
            onQuantityChanged(cartItem, cartItem.quantity - 1)
        }

        holder.increaseButton.setOnClickListener {
            onQuantityChanged(cartItem, cartItem.quantity + 1)
        }

        holder.removeButton.setOnClickListener {
            onRemoveItem(cartItem)
        }
    }

    override fun getItemCount() = cartItems.size
}