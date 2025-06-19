package com.example.shoppingapp.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.shoppingapp.R
import com.example.shoppingapp.adapters.CategoriesAdapter
import com.example.shoppingapp.models.Category
import io.realm.Realm
import java.util.*

class CategoriesFragment : Fragment() {

    private lateinit var realm: Realm
    private lateinit var recyclerView: RecyclerView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_categories, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        realm = Realm.getDefaultInstance()
        recyclerView = view.findViewById(R.id.recycler_categories)

        setupRecyclerView()
        loadCategories()
    }

    private fun setupRecyclerView() {
        recyclerView.layoutManager = LinearLayoutManager(context)
    }

    private fun loadCategories() {
        val categories = realm.where(Category::class.java).findAll()

        if (categories.isEmpty()) {
            // Dodaj przykładowe kategorie jeśli baza jest pusta
            addSampleCategories()
            return
        }

        val adapter = CategoriesAdapter(categories) { category ->
            // Obsługa kliknięcia kategorii
        }
        recyclerView.adapter = adapter
    }

    private fun addSampleCategories() {
        realm.executeTransaction { realm ->
            val category1 = realm.createObject(Category::class.java, UUID.randomUUID().toString())
            category1.name = "Elektronika"
            category1.description = "Telefony, komputery, akcesoria"

            val category2 = realm.createObject(Category::class.java, UUID.randomUUID().toString())
            category2.name = "Książki"
            category2.description = "Literatura, poradniki, komiksy"

            val category3 = realm.createObject(Category::class.java, UUID.randomUUID().toString())
            category3.name = "Odzież"
            category3.description = "Ubrania, buty, akcesoria"
        }
        loadCategories()
    }

    override fun onDestroy() {
        super.onDestroy()
        realm.close()
    }
}