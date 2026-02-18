/**
 * Database Seed Script
 * Populates the database with test data for development
 *
 * Usage: node scripts/seed.js
 * or: npx ts-node scripts/seed.ts
 */

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  try {
    // Clear existing data (optional - be careful in production!)
    console.log('Limpiando datos existentes...');
    await prisma.message.deleteMany();
    await prisma.crisisSession.deleteMany();
    await prisma.volunteerProfile.deleteMany();
    await prisma.user.deleteMany();
    console.log('✓ Base de datos limpiada\n');

    // Create test users
    console.log('Creando usuarios de prueba...');

    const testUsers = [
      {
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'Admin123!',
        role: 'ADMIN',
      },
      {
        email: 'volunteer@example.com',
        name: 'María García',
        password: 'Volunteer123!',
        role: 'VOLUNTEER',
      },
      {
        email: 'volunteer2@example.com',
        name: 'Carlos López',
        password: 'Volunteer123!',
        role: 'VOLUNTEER',
      },
      {
        email: 'user@example.com',
        name: 'Juan Pérez',
        password: 'User123!',
        role: 'USER',
      },
    ];

    for (const userData of testUsers) {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          // In production, ALWAYS hash passwords!
          // For dev: passwords are stored as-is (NOT SECURE)
          password: hashPassword(userData.password),
          role: userData.role as any,
          emailVerified: new Date(),
        },
      });

      console.log(`✓ Usuario creado: ${user.email} (${user.role})`);

      // Create volunteer profiles for VOLUNTEER and ADMIN users
      if (userData.role === 'VOLUNTEER' || userData.role === 'ADMIN') {
        const profile = await prisma.volunteerProfile.create({
          data: {
            userId: user.id,
            specialization: getSpecialization(user.name),
            bio: `Profesional en crisis con experiencia en apoyo emocional.`,
            availability:
              Math.random() > 0.5
                ? 'AVAILABLE'
                : 'BUSY',
            sessionsCompleted: Math.floor(Math.random() * 50),
            averageRating: (Math.random() * 2 + 3).toFixed(1) as any,
          },
        });

        console.log(`  → Perfil de voluntario creado (ID: ${profile.id})`);
      }
    }

    console.log('\n✓ Usuarios creados exitosamente\n');

    // Create sample crisis sessions (optional)
    console.log('Creando sesiones de crisis de ejemplo...');

    const volunteers = await prisma.user.findMany({
      where: { role: 'VOLUNTEER' },
    });

    const regularUser = await prisma.user.findUnique({
      where: { email: 'user@example.com' },
    });

    if (volunteers.length > 0 && regularUser) {
      for (let i = 0; i < 3; i++) {
        const session = await prisma.crisisSession.create({
          data: {
            userId: regularUser.id,
            volunteerId: volunteers[i % volunteers.length].id,
            title: `Sesión de crisis #${i + 1}`,
            description: `Sesión de apoyo emocional para usuario en crisis.`,
            status: i === 0 ? 'ACTIVE' : 'COMPLETED',
            startedAt: new Date(Date.now() - i * 86400000),
            endedAt:
              i === 0
                ? null
                : new Date(
                    Date.now() -
                    i * 86400000 +
                    3600000
                  ),
          },
        });

        console.log(`✓ Sesión creada: ${session.title} (ID: ${session.id})`);
      }
    }

    console.log('\n✅ Seed completado exitosamente!\n');

    // Print summary
    console.log('📊 Resumen:');
    const userCount = await prisma.user.count();
    const sessionCount = await prisma.crisisSession.count();
    const messageCount = await prisma.message.count();

    console.log(`  • Usuarios: ${userCount}`);
    console.log(`  • Sesiones: ${sessionCount}`);
    console.log(`  • Mensajes: ${messageCount}\n`);

    // Print test credentials
    console.log('🔑 Credenciales de prueba:');
    console.log(
      '  Admin:     admin@example.com / Admin123!'
    );
    console.log(
      '  Volunteer: volunteer@example.com / Volunteer123!'
    );
    console.log(
      '  User:      user@example.com / User123!\n'
    );
  } catch (error) {
    console.error('❌ Error durante seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Hash password for database storage
 * ⚠️ In production, use bcrypt or similar
 */
function hashPassword(password: string): string {
  // Simple hash for dev - NOT secure for production!
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
}

/**
 * Get specialization based on name
 */
function getSpecialization(name: string): string {
  const specializations = [
    'Psicología Clínica',
    'Counseling',
    'Trabajo Social',
    'Psiquiatría',
  ];
  return specializations[
    name.charCodeAt(0) % specializations.length
  ];
}

main();
