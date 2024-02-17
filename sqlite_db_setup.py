import csv
import sqlite3

# Connecting to the meteorite_landing database
connection = sqlite3.connect('meteorite_landing.db')

# Creating a cursor object to execute SQL queries on the database
cursor = connection.cursor()

# Table Definition

# drop_table ='''DROP TABLE IF EXISTS meteorite_landing;'''

create_table = '''CREATE TABLE meteorite_landing(
                  meteorite_name TEXT NOT NULL,
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  nametype TEXT,
                  recclass TEXT,
                  "mass(g)" FLOAT,
                  fall TEXT,
                  year float,
                  latitude FLOAT,
                  longitude FLOAT,
                  GeoLocation TEXT);
                   '''

# Creating the table if it doesn't exist
cursor.execute(create_table)

# Opening the CSV file
with open('Resources/cleaned_data.csv', newline='', encoding='utf-8') as file:
    # Creating a CSV reader
    reader = csv.reader(file)
    # Skip the header row
    next(reader)
    # Iterate over each row in the CSV file and insert data into the table
    for row in reader:
        # Validate and convert data types as needed
        try:
            # Convert 'mass(g)' to float if it's not empty
            mass = float(row[4]) if row[4] else None
            # Convert 'year' to integer if it's not empty
            year = float(row[6]) if row[6] else None
            # Convert 'latitude' to float if it's not empty
            latitude = float(row[7]) if row[7] else None
            # Convert 'longitude' to float if it's not empty
            longitude = float(row[8]) if row[8] else None

            # SQL query to insert data into the table
            insert_records = '''INSERT INTO meteorite_landing (meteorite_name, nametype, recclass, "mass(g)", fall, year, latitude, longitude, GeoLocation)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'''
            # Execute the insert statement
            cursor.execute(insert_records, (row[0], row[2], row[3], mass, row[5], year, latitude, longitude, row[9]))
        except ValueError as e:
            print(f"Error inserting row: {row}. Invalid data format: {e}")
select_all = "SELECT * FROM meteorite_landing"
rows = cursor.execute(select_all).fetchall()
# Output to the console screen
for r in rows:
    print(r)
# Commit the changes
connection.commit()

# Close the database connection
connection.close()