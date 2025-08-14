
import { DatabaseService } from '../lib/database';
import { 
  MOCK_USERS, MOCK_CLIENTS, MOCK_PROJECTS, MOCK_TEAM_MEMBERS, 
  MOCK_TRANSACTIONS, MOCK_PACKAGES, MOCK_ADDONS, MOCK_TEAM_PROJECT_PAYMENTS, 
  MOCK_TEAM_PAYMENT_RECORDS, MOCK_FINANCIAL_POCKETS, MOCK_USER_PROFILE, 
  MOCK_LEADS, MOCK_REWARD_LEDGER_ENTRIES, MOCK_CARDS, MOCK_ASSETS, 
  MOCK_CLIENT_FEEDBACK, MOCK_CONTRACTS, MOCK_NOTIFICATIONS, 
  MOCK_SOCIAL_MEDIA_POSTS, MOCK_PROMO_CODES, MOCK_SOPS 
} from '../constants';

export async function migrateMockData() {
  console.log('Starting mock data migration...');

  try {
    // Migrate Users
    console.log('Migrating users...');
    for (const user of MOCK_USERS) {
      await DatabaseService.createUser(user);
    }

    // Migrate Clients
    console.log('Migrating clients...');
    for (const client of MOCK_CLIENTS) {
      await DatabaseService.createClient(client);
    }

    // Migrate Packages
    console.log('Migrating packages...');
    for (const pkg of MOCK_PACKAGES) {
      await DatabaseService.createPackage(pkg);
    }

    // Migrate Add-ons
    console.log('Migrating add-ons...');
    for (const addon of MOCK_ADDONS) {
      await DatabaseService.createAddOn(addon);
    }

    // Migrate Team Members
    console.log('Migrating team members...');
    for (const member of MOCK_TEAM_MEMBERS) {
      await DatabaseService.createTeamMember(member);
    }

    // Migrate Cards
    console.log('Migrating cards...');
    for (const card of MOCK_CARDS) {
      await DatabaseService.createCard(card);
    }

    // Migrate Financial Pockets
    console.log('Migrating financial pockets...');
    for (const pocket of MOCK_FINANCIAL_POCKETS) {
      await DatabaseService.createFinancialPocket(pocket);
    }

    // Migrate Projects
    console.log('Migrating projects...');
    for (const project of MOCK_PROJECTS) {
      await DatabaseService.createProject(project);
    }

    // Migrate Transactions
    console.log('Migrating transactions...');
    for (const transaction of MOCK_TRANSACTIONS) {
      await DatabaseService.createTransaction(transaction);
    }

    // Migrate Leads
    console.log('Migrating leads...');
    for (const lead of MOCK_LEADS) {
      await DatabaseService.createLead(lead);
    }

    // Migrate Assets
    console.log('Migrating assets...');
    for (const asset of MOCK_ASSETS) {
      await DatabaseService.createAsset(asset);
    }

    // Migrate Contracts
    console.log('Migrating contracts...');
    for (const contract of MOCK_CONTRACTS) {
      await DatabaseService.createContract(contract);
    }

    // Migrate Client Feedback
    console.log('Migrating client feedback...');
    for (const feedback of MOCK_CLIENT_FEEDBACK) {
      await DatabaseService.createClientFeedback(feedback);
    }

    // Migrate Team Project Payments
    console.log('Migrating team project payments...');
    for (const payment of MOCK_TEAM_PROJECT_PAYMENTS) {
      await DatabaseService.createTeamProjectPayment(payment);
    }

    // Migrate Team Payment Records
    console.log('Migrating team payment records...');
    for (const record of MOCK_TEAM_PAYMENT_RECORDS) {
      await DatabaseService.createTeamPaymentRecord(record);
    }

    // Migrate Reward Ledger Entries
    console.log('Migrating reward ledger entries...');
    for (const entry of MOCK_REWARD_LEDGER_ENTRIES) {
      await DatabaseService.createRewardLedgerEntry(entry);
    }

    // Migrate Notifications
    console.log('Migrating notifications...');
    for (const notification of MOCK_NOTIFICATIONS) {
      await DatabaseService.createNotification(notification);
    }

    // Migrate Social Media Posts
    console.log('Migrating social media posts...');
    for (const post of MOCK_SOCIAL_MEDIA_POSTS) {
      await DatabaseService.createSocialMediaPost(post);
    }

    // Migrate Promo Codes
    console.log('Migrating promo codes...');
    for (const promoCode of MOCK_PROMO_CODES) {
      await DatabaseService.createPromoCode(promoCode);
    }

    // Migrate SOPs
    console.log('Migrating SOPs...');
    for (const sop of MOCK_SOPS) {
      await DatabaseService.createSOP(sop);
    }

    // Migrate Profile
    console.log('Migrating profile...');
    await DatabaseService.updateProfile(MOCK_USER_PROFILE);

    console.log('Mock data migration completed successfully!');
  } catch (error) {
    console.error('Error migrating mock data:', error);
    throw error;
  }
}

// Run the migration if this script is executed directly
if (typeof window === 'undefined') {
  migrateMockData().catch(console.error);
}
