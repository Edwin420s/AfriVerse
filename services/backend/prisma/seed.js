const { PrismaClient } = require('@prisma/client');
const logger = require('../src/utils/logger');

const prisma = new PrismaClient();

async function main() {
  logger.info('Starting database seeding...');

  // Create default communities
  const communities = await Promise.all([
    prisma.community.upsert({
      where: { name: 'general' },
      update: {},
      create: {
        name: 'general',
        description: 'General cultural knowledge from all African communities',
        language: 'sw',
        region: 'Africa',
        validators: ['system_validator'],
        rules: {
          allowedLanguages: ['sw', 'en', 'fr', 'pt'],
          minValidators: 1,
          restrictSensitiveContent: true,
          sensitiveTerms: ['sacred', 'secret', 'restricted']
        }
      }
    }),
    prisma.community.upsert({
      where: { name: 'kikuyu' },
      update: {},
      create: {
        name: 'kikuyu',
        description: 'Kikuyu community knowledge and traditions',
        language: 'ki',
        region: 'Central Kenya',
        validators: ['kikuyu_elder_1', 'kikuyu_elder_2'],
        rules: {
          allowedLanguages: ['ki', 'sw'],
          minValidators: 2,
          restrictSensitiveContent: true,
          sensitiveTerms: ['mugo', 'kiama', 'ndundu']
        }
      }
    }),
    prisma.community.upsert({
      where: { name: 'maasai' },
      update: {},
      create: {
        name: 'maasai',
        description: 'Maasai community pastoral knowledge and rituals',
        language: 'mas',
        region: 'Southern Kenya/Northern Tanzania',
        validators: ['maasai_elder_1', 'maasai_elder_2'],
        rules: {
          allowedLanguages: ['mas', 'sw'],
          minValidators: 2,
          restrictSensitiveContent: true,
          sensitiveTerms: ['laibon', 'olpul', 'eunoto']
        }
      }
    })
  ]);

  logger.info(`Created ${communities.length} communities`);

  // Create sample entries for demonstration
  const sampleEntries = await Promise.all([
    prisma.entry.create({
      data: {
        cid: 'QmSample1AloeVera',
        title: 'Aloe Vera Medicinal Uses',
        submitter: 'community_elder',
        language: 'sw',
        license: 'CC-BY-NC-4.0',
        status: 'validated',
        transcript: 'Aloe vera, locally known as mwarubaini, is used to treat burns and skin irritations. The gel is applied directly to the affected area.',
        atoms: [
          '(plant "aloe_vera")',
          '(has_local_name "aloe_vera" "mwarubaini")',
          '(property "aloe_vera" "soothing")',
          '(treats "aloe_vera" "burn")',
          '(treats "aloe_vera" "skin_irritation")',
          '(used_for "aloe_vera" "first_aid")',
          '(found_in "aloe_vera" "eastern_africa")'
        ],
        community: 'general',
        metadata: {
          source: 'oral_tradition',
          region: 'Eastern Africa',
          verified: true
        }
      }
    }),
    prisma.entry.create({
      data: {
        cid: 'QmSample2NeemTree',
        title: 'Neem Tree Traditional Uses',
        submitter: 'traditional_healer',
        language: 'sw',
        license: 'CC-BY-NC-4.0',
        status: 'symbolized',
        transcript: 'The neem tree leaves are boiled to make tea that helps with malaria. The bark is used for dental care.',
        atoms: [
          '(plant "neem")',
          '(has_local_name "neem" "muarubaini")',
          '(property "neem" "antibacterial")',
          '(property "neem" "antimalarial")',
          '(treats "neem" "malaria")',
          '(used_for "neem" "traditional_tea")',
          '(used_for "neem" "dental_care")'
        ],
        community: 'general',
        metadata: {
          source: 'traditional_healer',
          region: 'Coastal Kenya',
          verification_status: 'pending'
        }
      }
    })
  ]);

  logger.info(`Created ${sampleEntries.length} sample entries`);

  // Create sample validations
  const sampleValidations = await Promise.all([
    prisma.validation.create({
      data: {
        entryId: sampleEntries[0].id,
        validator: 'system_validator',
        decision: 'approved',
        notes: 'Traditional knowledge verified by community elders'
      }
    })
  ]);

  logger.info(`Created ${sampleValidations.length} sample validations`);

  logger.info('Database seeding completed successfully!');
}

main()
  .catch((error) => {
    logger.error('Database seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });