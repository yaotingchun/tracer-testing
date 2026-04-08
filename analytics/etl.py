import sys

def run_etl():
    print("Starting Analytics ETL Process...")
    # Mocking order query records
    mock_db_records = [
        {"id": 101, "user_id": 1, "status": "paid", "total_amount": 99.99},
        {"id": 102, "user_id": 2, "status": "paid", "total_amount": 149.50}
    ]
    
    transformed = []
    for record in mock_db_records:
        # Critical dependency on database order field: 'user_id'
        print(f"Transforming details for user: {record['user_id']}")
        transformed.append({
            "order_id": record["id"],
            "customer_id": record["user_id"],
            "amount": record["total_amount"],
            "status": record["status"]
        })
    
    print(f"ETL Complete. Loaded {len(transformed)} records.")

if __name__ == "__main__":
    run_etl()
