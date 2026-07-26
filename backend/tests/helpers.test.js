const jwt = require('jsonwebtoken');
const { formatearMonto, formatearFecha, generarToken } = require('../utils/helpers');

describe('utils/helpers', () => {
  describe('formatearMonto', () => {
    it('debe formatear un número con dos decimales', () => {
      expect(formatearMonto(10)).toBe('10.00');
      expect(formatearMonto('99.999')).toBe('100.00');
      expect(formatearMonto(0)).toBe('0.00');
    });
  });

  describe('formatearFecha', () => {
    it('debe devolver la fecha en formato YYYY-MM-DD', () => {
      expect(formatearFecha('2026-03-15T10:00:00Z')).toBe('2026-03-15');
    });
  });

  describe('generarToken', () => {
    beforeAll(() => {
      process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
    });

    it('debe generar un JWT válido y firmado con el id y el email del usuario', () => {
      const token = generarToken({ id: 42, email: 'test@test.com' });
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      expect(payload.id).toBe(42);
      expect(payload.email).toBe('test@test.com');
    });
  });
});
