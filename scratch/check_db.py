import sqlite3

def check_db():
    try:
        conn = sqlite3.connect("produtos.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM produtos")
        rows = cursor.fetchall()
        print(f"Total produtos: {len(rows)}")
        for row in rows:
            print(f"ID: {row['id']}, Nome: {row['nome']}, Imagem1: '{row['imagem1']}', Imagem2: '{row['imagem2']}'")
        conn.close()
    except Exception as e:
        print(f"Erro ao acessar DB: {e}")

if __name__ == "__main__":
    check_db()
