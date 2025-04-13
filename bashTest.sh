#!/bin/bash

# Konfiguracja
BASE_URL="http://localhost:8000/product"
HEADERS=(-H "Content-Type: application/json" -H "Accept: application/json")

# Funkcje pomocnicze
print_separator() {
    echo "--------------------------------------------------"
}

print_title() {
    echo -e "\n\033[1;36m$1\033[0m"
    print_separator
}

print_result() {
    if [ "$1" -eq 0 ]; then
        echo -e "\033[1;32m[SUCCESS]\033[0m $2"
    else
        echo -e "\033[1;31m[FAILED]\033[0m $2"
    fi
}

# Test 1: Pobieranie listy produktów (GET)
print_title "TEST 1: Pobieranie listy produktów (GET)"
response=$(curl -s -o /dev/null -w "%{http_code}" "${HEADERS[@]}" "${BASE_URL}/")
if [ "$response" -eq 200 ]; then
    curl -s "${HEADERS[@]}" "${BASE_URL}/" | jq .
    print_result 0 "GET ${BASE_URL}/ - Status: $response"
else
    print_result 1 "GET ${BASE_URL}/ - Status: $response"
fi

# Test 2: Tworzenie nowego produktu (POST)
print_title "TEST 2: Tworzenie nowego produktu (POST)"
product_data='{
    "product": {
        "name": "Testowy produkt",
        "description": "Opis testowego produktu",
        "price": 99.99
    }
}'
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${HEADERS[@]}" -d "$product_data" "${BASE_URL}/new")
if [ "$response" -eq 201 ]; then
    created_product=$(curl -s -X POST "${HEADERS[@]}" -d "$product_data" "${BASE_URL}/new")
    product_id=$(echo "$created_product" | jq -r '.product.id')
    echo "$created_product" | jq .
    print_result 0 "POST ${BASE_URL}/new - Status: $response"
else
    print_result 1 "POST ${BASE_URL}/new - Status: $response"
    exit 1
fi

# Test 3: Pobieranie pojedynczego produktu (GET)
print_title "TEST 3: Pobieranie produktu (GET)"
if [ -n "$product_id" ]; then
    response=$(curl -s -o /dev/null -w "%{http_code}" "${HEADERS[@]}" "${BASE_URL}/${product_id}")
    if [ "$response" -eq 200 ]; then
        curl -s "${HEADERS[@]}" "${BASE_URL}/${product_id}" | jq .
        print_result 0 "GET ${BASE_URL}/${product_id} - Status: $response"
    else
        print_result 1 "GET ${BASE_URL}/${product_id} - Status: $response"
    fi
else
    print_result 1 "Nie udało się uzyskać ID produktu"
fi

# Test 4: Aktualizacja produktu (POST)
print_title "TEST 4: Aktualizacja produktu (POST)"
if [ -n "$product_id" ]; then
    update_data='{
        "product": {
            "name": "Zaktualizowany produkt",
            "description": "Nowy opis",
            "price": 129.99
        }
    }'
    response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${HEADERS[@]}" -d "$update_data" "${BASE_URL}/${product_id}/edit")
    if [ "$response" -eq 200 ]; then
        updated_product=$(curl -s -X POST "${HEADERS[@]}" -d "$update_data" "${BASE_URL}/${product_id}/edit")
        echo "$updated_product" | jq .
        print_result 0 "POST ${BASE_URL}/${product_id}/edit - Status: $response"
    else
        print_result 1 "POST ${BASE_URL}/${product_id}/edit - Status: $response"
    fi
else
    print_result 1 "Nie udało się uzyskać ID produktu"
fi

print_title "TEST 5: Usuwanie produktu (DELETE)"
if [ -n "$product_id" ]; then
    # Zmieniamy metodę na DELETE
    response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "${HEADERS[@]}" "${BASE_URL}/${product_id}")
    
    if [ "$response" -eq 200 ]; then
        print_result 0 "DELETE ${BASE_URL}/${product_id} - Status: $response"
        
        # Weryfikacja usunięcia
        response=$(curl -s -o /dev/null -w "%{http_code}" "${HEADERS[@]}" "${BASE_URL}/${product_id}")
        if [ "$response" -eq 404 ]; then
            print_result 0 "Produkt został prawidłowo usunięty"
        else
            print_result 1 "Produkt nie został usunięty"
        fi
    else
        print_result 1 "DELETE ${BASE_URL}/${product_id} - Status: $response"
    fi
else
    print_result 1 "Nie udało się uzyskać ID produktu"
fi

print_title "Podsumowanie testów"
echo -e "Przetestowano wszystkie endpointy CRUD dla produktów"
print_separator