#!/usr/bin/env node

/**
 * Database Seed Script (JavaScript)
 * Populates the database with test data for development
 *
 * Usage: npm run seed
 * or: node scripts/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  try {
    // Clear existing data
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

    const createdUsers = [];

    for (const userData of testUsers) {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          // For dev: passwords hashed with SHA-256 (NOT secure for production)
          password: crypto
            .createHash('sha256')
            .update(userData.password)
            .digest('hex'),
          role: userData.role,
          emailVerified: new Date(),
        },
      });

      createdUsers.push(user);
      console.log(`✓ Usuario creado: ${user.email} (${user.role})`);

      // Create volunteer profiles
      if (userData.role === 'VOLUNTEER' || userData.role === 'ADMIN') {
        const specializations = [
          'Psicología Clínica',
          'Counseling',
          'Trabajo Social',
          'Psiquiatría',
        ];
        const specialization =
          specializations[user.name.charCodeAt(0) % specializations.length];

        const profile = await prisma.volunteerProfile.create({
          data: {
            userId: user.id,
            specialization,
            bio: 'Profesional en crisis con experiencia en apoyo emocional.',
            availability:
              Math.random() > 0.5
                ? 'AVAILABLE'
                : 'BUSY',
            sessionsCompleted: Math.floor(Math.random() * 50),
            averageRating: (Math.random() * 2 + 3).toFixed(1),
          },
        });

        console.log(`  → Perfil de voluntario creado (ID: ${profile.id})`);
      }
    }

    console.log('\n✓ Usuarios creados exitosamente\n');

    // Create sample crisis sessions
    console.log('Creando sesiones de crisis de ejemplo...');

    const volunteers = createdUsers.filter((u) => u.role === 'VOLUNTEER');
    const regularUser = createdUsers.find((u) => u.role === 'USER');

    if (volunteers.length > 0 && regularUser) {
      for (let i = 0; i < 3; i++) {
        const session = await prisma.crisisSession.create({
          data: {
            userId: regularUser.id,
            volunteerId: volunteers[i % volunteers.length].id,
            title: `Sesión de crisis #${i + 1}`,
            description: 'Sesión de apoyo emocional para usuario en crisis.',
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

main();
