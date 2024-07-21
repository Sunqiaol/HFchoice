import pandas as pd

# Load the Excel file
file_path = 'MERCANCIA+todos.xlsx'  # Replace with your actual file path
sheet_name = 'Sheet1'  # Replace with the actual sheet name if necessary

# Read the Excel file, skipping the first row and using the second row as header
df = pd.read_excel(file_path, sheet_name=sheet_name, skiprows=1)

# Drop the first column
df.drop(df.columns[0], axis=1, inplace=True)

# Rename the columns to match the titles in the image
df.columns = ["CODIGO", "DESCRIPCION", "MARCA", "GRUPO", "UNIDA", "COSTO", "P-A", "P-B"]

# Base URL for picture
base_url = "http://190.140.249.241/hungfazl/fotos/"

# Create the SQL INSERT statements
sql_statements = []

for index, row in df.iterrows():
    picture_url = base_url + str(row["CODIGO"])
    sql = f"""
    INSERT INTO item (
        picture, codigo, discripcion, marca, grupo, unidad, costo, p_a, p_b, p_c, p_d, inve, un_ctn, ctns, visible
    ) VALUES (
        '{picture_url}', '{row["CODIGO"]}', '{row["DESCRIPCION"]}', '{row["MARCA"]}', '{row["GRUPO"]}', '{row["UNIDA"]}', 
        '{row["COSTO"]}', '{row["P-A"]}', '{row["P-B"]}', '', '', '', '', '', 1
    );
    """
    sql_statements.append(sql.strip())

# Save the SQL statements to a text file with UTF-8 encoding
with open('insert_statements.txt', 'w', encoding='utf-8') as file:
    for sql in sql_statements:
        file.write(sql + "\n")

print("SQL statements have been saved to insert_statements.txt")
