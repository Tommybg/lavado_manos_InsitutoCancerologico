paso a paso para usar venv

1. Crear un entorno virtual
```bash
python -m venv venv
```

2. Activar el entorno virtual
```bash
# En Windows
venv\Scripts\activate.bat
# En Windows (Powershell)
venv\Scripts\Activate.ps1


# En Linux o Mac
source venv/bin/activate
```

3. Instalar las dependencias
```bash
pip install -r requirements.txt
```
4. Desactivar el entorno virtual
```bash
deactivate
```