import os
import sqlite3

# Import Cloudinary
try:
    import cloudinary
    import cloudinary.uploader
    HAVE_CLOUDINARY = True
except ImportError:
    HAVE_CLOUDINARY = False

try:
    import psycopg2
    import psycopg2.extras
    HAVE_PSYG = True
except ImportError:
    HAVE_PSYG = False

from flask import Flask, render_template, request, redirect, session, url_for
from dotenv import load_dotenv

load_dotenv(override=True)

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "mr-injetados-default-key-2026")

# Cloudinary Config
if HAVE_CLOUDINARY:
    cloudinary.config(
        cloud_name = os.environ.get("CLOUD_NAME"),
        api_key = os.environ.get("API_KEY"),
        api_secret = os.environ.get("API_SECRET")
    )

# Configurações de Admin (Sem valores padrão no código para segurança)
ADMIN_USER = os.environ.get("ADMIN_USER", "admin").strip().lower()
ADMIN_PASS = (os.environ.get("ADMIN_PASS") or "").strip()

# Log de inicialização para depuração no Railway
print("--- CONFIGURAÇÃO DE AMBIENTE ---")
print(f"ADMIN_USER carregado: '{ADMIN_USER}' (tamanho: {len(ADMIN_USER)})")
print(f"ADMIN_PASS carregado: {'SIM' if ADMIN_PASS else 'NÃO'} (tamanho: {len(ADMIN_PASS)})")
print(f"DATABASE_URL presente: {'SIM' if os.environ.get('DATABASE_URL') else 'NÃO'}")
print(f"HAVE_CLOUDINARY: {HAVE_CLOUDINARY}")
if HAVE_CLOUDINARY:
    print(f"CLOUD_NAME: {os.environ.get('CLOUD_NAME')}")
    print(f"API_KEY presente: {'SIM' if os.environ.get('API_KEY') else 'NÃO'}")
print("--------------------------------")

DATABASE_URL = os.environ.get("DATABASE_URL")

def get_db():
    if DATABASE_URL and HAVE_PSYG:
        conn = psycopg2.connect(DATABASE_URL, sslmode='require')
        return conn
    else:
        conn = sqlite3.connect("produtos.db")
        conn.row_factory = sqlite3.Row
        return conn

def execute_query(query, params=(), fetch=False):
    conn = get_db()
    is_pg = DATABASE_URL and HAVE_PSYG
    if is_pg:
        query = query.replace("?", "%s")
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    else:
        cursor = conn.cursor()
    cursor.execute(query, params)
    result = cursor.fetchall() if fetch else None
    conn.commit()
    cursor.close()
    conn.close()
    return result

def criar_db():
    is_pg = DATABASE_URL and HAVE_PSYG
    id_type = "SERIAL PRIMARY KEY" if is_pg else "INTEGER PRIMARY KEY AUTOINCREMENT"
    execute_query(f"CREATE TABLE IF NOT EXISTS produtos (id {id_type}, nome TEXT, preco TEXT, categoria TEXT, material TEXT, numeracao TEXT, imagem1 TEXT, imagem2 TEXT)")
    execute_query(f"CREATE TABLE IF NOT EXISTS categorias (id {id_type}, nome TEXT UNIQUE)")

criar_db()

@app.route("/")
def index():
    produtos = execute_query("SELECT * FROM produtos ORDER BY id DESC", fetch=True)
    categorias = execute_query("SELECT * FROM categorias ORDER BY nome ASC", fetch=True)
    return render_template("index.html", produtos=produtos, categorias=categorias)

@app.route("/login", methods=["GET","POST"])
def login():
    # Mensagem de erro caso a senha não tenha sido configurada no ambiente
    if not ADMIN_PASS:
        return "ERRO DE SEGURANÇA: ADMIN_PASS não configurada no ambiente.", 500

    if request.method == "POST":
        user = (request.form.get("user") or "").strip().lower()
        senha = (request.form.get("senha") or "").strip()
        
        # Log de debug mais detalhado
        pass_len = len(ADMIN_PASS) if ADMIN_PASS else 0
        input_len = len(senha)
        print(f"DEBUG: Tentativa login usuário '{user}' | Senha digitada tam: {input_len} | Senha config tam: {pass_len}")
        
        if user == ADMIN_USER and senha == ADMIN_PASS:
            print("Login bem-sucedido!")
            session["logado"] = True
            return redirect(url_for("admin"))
        else:
            print("Login falhou:")
            if user != ADMIN_USER:
                print(f"  - Usuário não bate! Esperado: '{ADMIN_USER}' (tam: {len(ADMIN_USER)}), Recebido: '{user}' (tam: {len(user)})")
            if senha != ADMIN_PASS:
                print(f"  - Senha não bate! Esperado tam: {len(ADMIN_PASS)}, Recebido tam: {len(senha)}")
    return render_template("login.html")

@app.route("/admin")
def admin():
    if not session.get("logado"):
        return redirect(url_for("login"))
    produtos = execute_query("SELECT * FROM produtos ORDER BY id DESC", fetch=True)
    categorias = execute_query("SELECT * FROM categorias ORDER BY nome ASC", fetch=True)
    return render_template("admin.html", 
                           produtos=produtos, 
                           categorias=categorias,
                           total_produtos=len(produtos),
                           total_categorias=len(categorias))

@app.route("/add", methods=["POST"])
def add():
    if not session.get("logado"):
        return redirect(url_for("login"))

    # Upload para o Cloudinary
    url1 = ""
    url2 = ""
    
    file1 = request.files.get("foto1")
    file2 = request.files.get("foto2")

    try:
        if HAVE_CLOUDINARY:
            if file1 and file1.filename != '':
                print(f"Tentando upload foto1: {file1.filename}")
                upload_result = cloudinary.uploader.upload(file1)
                url1 = upload_result.get("secure_url")
                print(f"Sucesso foto1: {url1}")
            
            if file2 and file2.filename != '':
                print(f"Tentando upload foto2: {file2.filename}")
                upload_result = cloudinary.uploader.upload(file2)
                url2 = upload_result.get("secure_url")
                print(f"Sucesso foto2: {url2}")
        else:
            print("AVISO: Cloudinary não instalado ou não configurado. Imagem não será salva.")
    except Exception as e:
        print(f"ERRO CRÍTICO CLOUDINARY: {e}")
        # Prossegue sem as URLs de imagem se o upload falhar, evitando Erro 500

    data = (
        request.form.get("nome"),
        request.form.get("preco"),
        request.form.get("categoria") or "",
        request.form.get("material"),
        request.form.get("numeracao"),
        url1,
        url2
    )

    execute_query("INSERT INTO produtos (nome, preco, categoria, material, numeracao, imagem1, imagem2) VALUES (?, ?, ?, ?, ?, ?, ?)", data)
    return redirect(url_for("admin"))

@app.route("/delete/<int:id>")
def delete(id):
    if not session.get("logado"):
        return redirect(url_for("login"))
    execute_query("DELETE FROM produtos WHERE id=?", (id,))
    return redirect(url_for("admin"))

@app.route("/categoria/add", methods=["POST"])
def add_categoria():
    if not session.get("logado"):
        return redirect(url_for("login"))
    nome = request.form.get("nome", "").lower().strip()
    if nome:
        query = "INSERT INTO categorias (nome) VALUES (?) ON CONFLICT (nome) DO NOTHING" if (DATABASE_URL and HAVE_PSYG) else "INSERT OR IGNORE INTO categorias (nome) VALUES (?)"
        execute_query(query, (nome,))
    return redirect(url_for("admin"))

@app.route("/categoria/delete/<int:id>")
def delete_categoria(id):
    if not session.get("logado"):
        return redirect(url_for("login"))
    execute_query("DELETE FROM categorias WHERE id=?", (id,))
    return redirect(url_for("admin"))

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

@app.errorhandler(404)
def not_found(e):
    return render_template("index.html", produtos=[], categorias=[]), 404

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("DEBUG", "True").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)


