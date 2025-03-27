# Aplicación con visión artificial para lavado de manos

## Pasos para ejecutar el proyecto
1. Crear un entorno virtual
```bash
python -m venv venv
```

2. Activar el entorno virtual
```bash
# En Windows
.\env\Scripts\activate.bat # Opción para CMD
.\env\Scripts\activate.ps1 # Opción para PowerShell

# En Linux o Mac
source env/bin/activate
```


3. Instalar las dependencias
```bash
pip install -r requirements.txt

# Opción alternativa
pip install flask flask-socketio opencv-python numpy torch torchvision Pillow ultralytics
```

4. Ejecutar el script
```bash
python app.py
```

5. Abrir el navegador y acceder a la dirección
```
localhost:5000

127.0.0.1:5000
```