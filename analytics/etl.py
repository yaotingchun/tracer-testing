import sys

def run_etl():
    print("Starting Analytics ETL Process...")
    # Ethan: Mocking updated database query containing customer_id instead of user_id
    mock_db_records = [
        {"id": 101, "customer_id": 1, "status": "paid", "total_amount": 99.99},
        {"id": 102, "customer_id": 2, "status": "paid", "total_amount": 149.50}
    ]
    
    transformed = []
    for record in mock_db_records:
        # Fixed field key reference from user_id to customer_id
        print(f"Transforming details for customer: {record['customer_id']}")
        transformed.append({
            "order_id": record["id"],
            "customer_id": record["customer_id"],
            "amount": record["total_amount"],
            "status": record["status"]
        })
    
    print(f"ETL Complete. Loaded {len(transformed)} records.")

if __name__ == "__main__":
    run_etl()
