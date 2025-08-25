#!/usr/bin/env python3
"""
Script to add COLLECTED status to RequestStatus enum
"""
import psycopg2
from app.core.config import settings

def add_collected_status():
    try:
        # Connect to database
        conn = psycopg2.connect(
            host=settings.POSTGRES_HOST,
            port=settings.POSTGRES_PORT,
            database=settings.POSTGRES_DB,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD
        )
        
        cursor = conn.cursor()
        
        # Check if COLLECTED already exists
        cursor.execute("SELECT unnest(enum_range(NULL::requeststatus))")
        existing_values = [row[0] for row in cursor.fetchall()]
        
        if 'COLLECTED' not in existing_values:
            print("Adding COLLECTED to RequestStatus enum...")
            cursor.execute("ALTER TYPE requeststatus ADD VALUE 'COLLECTED'")
            conn.commit()
            print("✅ Successfully added COLLECTED status!")
        else:
            print("✅ COLLECTED status already exists!")
            
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    add_collected_status()
