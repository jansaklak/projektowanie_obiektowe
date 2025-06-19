package com.example.shoppingapp.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.shoppingapp.R
import com.example.shoppingapp.adapters.CartAdapter
import com.example.shoppingapp.models.CartItem
import io.realm.Realm
import io.realm.RealmChangeListener
import kotlin.collections.sumOf

class CartFragment : Fragment() {

    private lateinit var realm: Realm
    private lateinit var recyclerView: RecyclerView
    private lateinit var totalText: TextView
    private lateinit var cartAdapter: CartAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_cart, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        realm = Realm.getDefaultInstance()
        recyclerView = view.findViewById(R.id.recycler_cart)
        totalText = view.findViewById(R.id.text_total)

        setupRecyclerView()
        loadCartItems()
    }

    private fun setupRecyclerView() {
        recyclerView.layoutManager = LinearLayoutManager(context)
    }

    private fun loadCartItems() {
        val cartItems = realm.where(CartItem::class.java).findAll()

        cartAdapter = CartAdapter(cartItems,
            onQuantityChanged = { cartItem, newQuantity ->
                updateQuantity(cartItem, newQuantity)
            },
            onRemoveItem = { cartItem ->
                removeFromCart(cartItem)
            }
        )

        recyclerView.adapter = cartAdapter

        // Obserwuj zmiany w koszyku
        cartItems.addChangeListener(RealmChangeListener {
            cartAdapter.notifyDataSetChanged()
            updateTotal()
        })

        updateTotal()
    }

    private fun updateQuantity(cartItem: CartItem, newQuantity: Int) {
        realm.executeTransaction {
            if (newQuantity <= 0) {
                cartItem.deleteFromRealm()
            } else {
                cartItem.quantity = newQuantity
            }
        }
    }

    private fun removeFromCart(cartItem: CartItem) {
        realm.executeTransaction {
            cartItem.deleteFromRealm()
        }
    }

    private fun updateTotal() {
        val cartItems = realm.where(CartItem::class.java).findAll()

        var total = 0.0
        for (item in cartItems) {
            total += item.price * item.quantity
        }

        totalText.text = String.format("%.2f zł", total)
    }

    override fun onDestroy() {
        super.onDestroy()
        realm.close()
    }
}