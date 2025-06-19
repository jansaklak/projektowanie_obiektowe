package com.example.shoppingapp

import android.app.Application
import io.realm.Realm
import io.realm.RealmConfiguration

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        Realm.init(this)
        val config = RealmConfiguration.Builder()
            .name("shopping.realm")
            .schemaVersion(1)
            .allowWritesOnUiThread(true) // Add this line
            .build()
        Realm.setDefaultConfiguration(config)
    }
}