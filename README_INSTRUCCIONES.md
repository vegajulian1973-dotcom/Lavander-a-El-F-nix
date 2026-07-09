# 🚀 Lavandería El Fénix - Landing Page & Backend

## 📋 Requisitos
- Node.js v16+ instalado
- npm v7+

## ⚙️ Instalación Inicial

```bash
# 1. Instala las dependencias
npm install

# 2. Copia el archivo de configuración
cp .env.example .env

# 3. (OPCIONAL) Edita .env si quieres cambiar la contraseña admin
```

---

## 🎯 Ejecutar en Desarrollo

### Opción 1: En dos terminales (RECOMENDADO)

**Terminal 1 - Backend:**
```bash
npm run server
```
Verás:
```
✅ Base de datos conectada
🚀 Servidor backend ejecutándose en http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Verás:
```
VITE v8.0.12  ready in 123 ms

➜  Local:   http://localhost:5173/
```

Abre `http://localhost:5173/` en tu navegador.

---

## 🔐 Credenciales de Admin

**Por defecto:**
- Contraseña: `admin123`

**Para producción (IMPORTANTE):**
1. Edita el archivo `.env`
2. Cambia `ADMIN_PASSWORD` a algo seguro
3. Reinicia el servidor

---

## 📊 Cómo funciona

### El Backend (localhost:3001)

**Rutas públicas:**
- `GET /api/opiniones` - Obtener todas las opiniones
- `POST /api/opiniones` - Crear nueva opinión

**Rutas admin (requieren token):**
- `PUT /api/opiniones/:id` - Responder opinión
- `DELETE /api/opiniones/:id` - Eliminar opinión
- `POST /api/admin/login` - Obtener token admin

### El Frontend (localhost:5173)

1. Usuario abre la página
2. Completa formulario y envía opinión ✅
3. Admin ingresa contraseña en el panel → recibe token
4. Token se guarda en `sessionStorage`
5. Admin puede responder/eliminar opiniones con token
6. Si recarga: mantiene sesión (token persiste)
7. Botón "Cerrar Sesión" limpia token

---

## 🐛 Solución de problemas

### "Error: Cannot find module 'sqlite'"
```bash
npm install sqlite
```

### "EADDRINUSE: address already in use :::3001"
El puerto 3001 ya está en uso. Opciones:
- Cierra lo que use el puerto 3001
- O cambia el puerto en `server.js` (línea 10)

### "No se conecta al backend"
Verifica que:
1. El backend está ejecutándose (`npm run server`)
2. Está en `http://localhost:3001`
3. No hay errores en la consola

### Las opiniones no se guardan
- El backend debe estar ejecutándose
- Revisa la consola del backend para errores
- Verifica que la carpeta está escribible (para crear `lavanderia.db`)

---

## 📁 Estructura de la base de datos

El backend crea automáticamente `lavanderia.db` con esta tabla:

```sql
CREATE TABLE opiniones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  comentario TEXT NOT NULL,
  calificacion INTEGER NOT NULL,
  recomienda TEXT NOT NULL,
  respuesta TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

## 🔒 Seguridad implementada

✅ **Fronted:** Contraseña NO está en el código
✅ **Login:** Se valida en el backend
✅ **Token:** Las operaciones admin requieren token válido
✅ **CORS:** Configurado para aceptar requests del frontend
✅ **Validación:** El backend valida todos los datos

---

## 📝 Próximos pasos (Mejoras)

Después de que todo funcione:
- [ ] Mejorar diseño tipo Linktree
- [ ] Agregar más servicios
- [ ] Rate limiting en login
- [ ] Cookies HttpOnly para mayor seguridad
- [ ] Hosting en producción

---

## ❓ Preguntas frecuentes

**P: ¿Puedo cambiar la contraseña admin?**
R: Sí, edita el archivo `.env` y reinicia el servidor.

**P: ¿Dónde se guardan las opiniones?**
R: En el archivo `lavanderia.db` (SQLite local).

**P: ¿Funciona offline?**
R: No, necesitas que el backend esté ejecutándose.

**P: ¿Puedo usar esto en producción?**
R: No así. Necesitas: base de datos real, HTTPS, variables de entorno, hosting profesional.

---

## 📞 Soporte

Si encuentras problemas:
1. Verifica los requisitos
2. Revisa la consola del navegador (F12)
3. Revisa la consola del servidor
4. Verifica que puertos 3001 y 5173 estén disponibles
