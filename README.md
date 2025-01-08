# Coupon Management API

## Backend Assessment Code for SDE-II role at Monk Commerce

API Host: http://13.53.132.132

### Cases Handled

#### 1. Cart-Wise Coupons
- **Description**: Apply a discount on the entire cart if the cart total exceeds a specific threshold.
- **Example**:
  - Coupon: 
    ```json
    {
        "type": "cart-wise",
        "details": {
            "threshold": 100,
            "discount": 10
        }
    }
    ```
  - Cart:
    ```json
    {
        "cart": {
            "items": [
                {
                    "product_id": 1,
                    "quantity": 2,
                    "price": 60
                }
            ]
        }
    }
    ```
  - Total: `120`
  - Discount: `120 * 10% = 12`
  - Final Price: `120 - 12 = 108`

#### 2. Product-Wise Coupons
- **Description**: Apply a discount to specific products in the cart. For now, only a **single occurrence** of the product is considered for discount calculation.
- **Example**:
  - Coupon:
    ```json
        {
            "type": "product-wise",
            "details": {
                "product_id": 1,
                "discount": 10
            }
        }
    ```
  - Cart: 
    ```json
    {
        "cart": {
            "items": [
                {
                    "product_id": 1,
                    "quantity": 6,
                    "price": 50
                }
            ]
        }
    }
    ```
  - Discount on Product 1: `50 * 6 * 10% = 30`
  - Final Price: `300 - 30 = 270`

#### 3. BxGy Coupons (Buy X, Get Y)
- **Description**: "Buy X, Get Y" deals where the "Buy" condition is OR. If a customer buys **3 units of Product X** or **3 units of Product Y**, they get **1 unit of Product Z for free**. The offer can be repeated based on the **repitition_limit**.
  
  The discount is calculated based on the total number of eligible sets, with a maximum repitition limit. Additionally, the "Get" product must exist in the cart for the discount to be applied. If the "Get" product is not found in the cart, no discount will be applied for that product.

  **Example**:
  - Coupon:
    ```json
    {
      "type": "bxgy",
      "details": {
        "buy_products": [
          { "product_id": 1, "quantity": 3 },
          { "product_id": 2, "quantity": 3 }
        ],
        "get_products": [
          { "product_id": 3, "quantity": 1 }
        ],
        "repitition_limit": 2
      }
    }
    ```
  - Cart:
    ```json
    {
        "cart": {
            "items": [
                { "product_id": 1, "quantity": 6, "price": 50 },
                { "product_id": 2, "quantity": 3, "price": 30 },
                { "product_id": 3, "quantity": 2, "price": 25 }
            ]
        }
    }
    ```
  - **Buy 3 of Product 1 (X) OR Buy 3 of Product 2 (Y)**
    - You can form 2 full sets:
      - 6 units of Product 1 → 2 sets (6 ÷ 3)
      - 3 units of Product 2 → 1 set (3 ÷ 3)
    - **Total discount**: You can get 2 units of Product 3 (Z) for free.
    - Discount = `2 * 25 = 50`
    
  **Note**: The offer can be used up to 2 times due to the repitition limit. The discount will only be applied if the "get product" (Product 3 in this case) exists in the cart.

#### 4. Maximum Combination of Discounts Selection
- **Description**: The API calculates the maximum combination of discounts by considering different coupon types applied to the cart. It does not simply select the maximum discount, but instead computes the combination of discounts yielding the highest total savings across applicable coupons.
- **Example**:
  - Coupons:
      - Cart-Wise: 
        ```json
        {
            "type": "cart-wise",
            "details": {
                "threshold": 200,
                "discount": 10
            }
        }
        ```
      - BxGy:
        ```json
        {
            "type": "bxgy",
            "details": {
                "buy_products": [
                    {
                        "product_id": 1,
                        "quantity": 3
                    }
                ],
                "get_products": [
                    {
                        "product_id": 2,
                        "quantity": 1
                    }
                ],
                "repitition_limit": 1
            }
        }
        ```
  - Cart:
    ```json
    {
        "cart": {
            "items": [
                { "product_id": 1, "quantity": 6, "price": 50 },
                { "product_id": 2, "quantity": 1, "price": 30 }
            ]
        }
    }
    ```
  - Cart-Wise Discount: `10% of 330 = 33`
  - BxGy Discount: `1 * 1 * 30 = 30`
  - Total Discount (Combination): `33 + 30 = 63`
  - Final Price: `330 - 63 = 267`

#### 5. Coupon Stacking
- **Description**: The API supports combining discounts from multiple coupon types for the same cart, maximizing the total discount benefit for the customer.
- **Example**:
  - Coupons:
    - Cart-Wise: 
      ```json
      {
        "type": "cart-wise",
        "details": {
            "threshold": 200,
            "discount": 10
        }
      }
      ```
    - Product-Wise: 
      ```json
      {
            "type": "product-wise",
            "details": {
                "product_id": 1,
                "discount": 20
            }
      }
      ```
  - Cart: 
    ```json
    {
        "cart": {
            "items": [
                { "product_id": 1, "quantity": 2, "price": 50 },
                { "product_id": 2, "quantity": 1, "price": 30 }
            ]
        }
    }
    ```
  - Cart-Wise Discount: `10% of 130 = 13`
  - Product-Wise Discount: `20% of (2 * 50) = 20`
  - Total Combined Discount: `33`
  - Final Price: `130 - 33 = 97`

### API Endpoints

#### /applicable-coupons
Returns list of applicable coupons for a given cart.

**Example Request:**
```json
{
    "cart": {
        "items": [
            {"product_id": 1, "quantity": 6, "price": 50},
            {"product_id": 2, "quantity": 3, "price": 30},
            {"product_id": 3, "quantity": 2, "price": 25}
        ]
    }
}
```

**Example Response:**
```json
{
    "applicable_coupons": [
        {
            "coupon_id": 1,
            "type": "cart-wise",
            "discount": 44
        },
        {
            "coupon_id": 2,
            "type": "product-wise",
            "discount": 60
        },
        {
            "coupon_id": 3,
            "type": "bxgy",
            "discount": 50
        }
    ]
}
```

#### /apply-coupon/{id}
Applies a specific coupon to the cart and returns updated cart details.

**Example Request:**
```json
{
    "cart": {
        "items": [
            {
                "product_id": 1,
                "quantity": 6,
                "price": 50
            },
            {
                "product_id": 2,
                "quantity": 3,
                "price": 30
            },
            {
                "product_id": 3,
                "quantity": 2,
                "price": 25
            }
        ]
    }
}
```

**Example Response:**
```json
{
    "updated_cart": {
        "items": [
            {
                "product_id": 1,
                "quantity": 6,
                "price": 50,
                "total_discount": 60
            },
            {
                "product_id": 2,
                "quantity": 3,
                "price": 30,
                "total_discount": 0
            },
            {
                "product_id": 3,
                "quantity": 4,
                "price": 25,
                "total_discount": 50
            }
        ],
        "total_price": 380,
        "total_discount": 38,
        "final_price": 342
    }
}
```

### Cases Not Handled (Limitations)

#### 1. Duplicate Product Entries in the Cart
- **Description**: If the cart contains duplicate entries for the same product, the system will not consolidate them automatically.
- **Example**:
  ```json
  {
      "items": [
          { "product_id": 1, "quantity": 6, "price": 50 },
          { "product_id": 1, "quantity": 7, "price": 50 }
      ]
  }
  ```
- Issue: The system treats them as separate items, potentially miscalculating discounts.
- Recommendation: Input validation should consolidate such entries.

#### 2. Coupon Expiry
- **Description**: The system does not validate coupon expiration dates or maximum usage limits.
- **Example**:
  ```json
  { 
      "type": "cart-wise", 
      "details": { 
          "threshold": 100, 
          "discount": 10, 
          "expiry": "2023-12-31" 
      } 
  }
  ```
- Issue: Even if the coupon is expired, the system does not reject it.

#### 3. Complex BxGy Scenarios
- **Description**: Overlapping "buy" or "get" products across multiple coupons are not supported.
- Issue: The system does not prioritize or combine overlapping rules effectively.

#### 4. BxGy Products with Product-Wise Coupons
- **Description**: The system does not handle cases where products in a BxGy offer also have product-wise coupons.
- **Example**:
  ```json
  {
      "coupons": [
          {
              "type": "bxgy",
              "details": {
                  "buy_products": [{"product_id": 1, "quantity": 3}],
                  "get_products": [{"product_id": 2, "quantity": 1}]
              }
          },
          {
              "type": "product-wise",
              "details": {
                  "product_id": 1,
                  "discount": 10
              }
          }
      ]
  }
  ```
- Issue: The system doesn't handle the interaction between these discount types.

#### 5. Coupon Combinations Exceeding Total Price
- **Description**: The system does not handle cases where combined discounts exceed the cart's total price.
- **Example**:
  ```json
  {
      "cart": {
          "items": [
              {"product_id": 1, "quantity": 1, "price": 100}
          ]
      },
      "coupons": [
          {
              "type": "cart-wise",
              "details": {"discount": 60}
          },
          {
              "type": "product-wise",
              "details": {
                  "product_id": 1,
                  "discount": 50
              }
          }
      ]
  }
  ```
- Issue: Combined discount (110) exceeds total price, leading to negative final price.

## Note

- The spelling of the key `repetition_limit` was mistakenly written as `repitition_limit` in the provided examples. For this implementation, the API assumes `repitition_limit` as the valid key. Please ensure consistency in future inputs and configurations.