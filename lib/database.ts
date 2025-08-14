
import { supabase } from './supabase'
import { 
  User, Client, Project, TeamMember, Transaction, Package, AddOn, 
  FinancialPocket, Card, Asset, Contract, ClientFeedback, Lead, 
  RewardLedgerEntry, TeamProjectPayment, TeamPaymentRecord, 
  Notification, SocialMediaPost, PromoCode, SOP, Profile
} from '../types'

export class DatabaseService {
  // Users
  static async getUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*')
    if (error) throw error
    return data || []
  }

  static async createUser(user: Omit<User, 'id'>): Promise<User> {
    const { data, error } = await supabase.from('users').insert(user).select().single()
    if (error) throw error
    return data
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deleteUser(id: string): Promise<void> {
    const { error } = await supabase.from('users').delete().eq('id', id)
    if (error) throw error
  }

  // Clients
  static async getClients(): Promise<Client[]> {
    const { data, error } = await supabase.from('clients').select('*')
    if (error) throw error
    return data || []
  }

  static async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    const { data, error } = await supabase.from('clients').insert(client).select().single()
    if (error) throw error
    return data
  }

  static async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase.from('clients').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deleteClient(id: string): Promise<void> {
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) throw error
  }

  // Projects
  static async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase.from('projects').select('*')
    if (error) throw error
    return data || []
  }

  static async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const { data, error } = await supabase.from('projects').insert(project).select().single()
    if (error) throw error
    return data
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
  }

  // Team Members
  static async getTeamMembers(): Promise<TeamMember[]> {
    const { data, error } = await supabase.from('team_members').select('*')
    if (error) throw error
    return data || []
  }

  static async createTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    const { data, error } = await supabase.from('team_members').insert(member).select().single()
    if (error) throw error
    return data
  }

  static async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    const { data, error } = await supabase.from('team_members').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deleteTeamMember(id: string): Promise<void> {
    const { error } = await supabase.from('team_members').delete().eq('id', id)
    if (error) throw error
  }

  // Transactions
  static async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false })
    if (error) throw error
    return data || []
  }

  static async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const { data, error } = await supabase.from('transactions').insert(transaction).select().single()
    if (error) throw error
    return data
  }

  static async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase.from('transactions').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) throw error
  }

  // Packages
  static async getPackages(): Promise<Package[]> {
    const { data, error } = await supabase.from('packages').select('*')
    if (error) throw error
    return data || []
  }

  static async createPackage(pkg: Omit<Package, 'id'>): Promise<Package> {
    const { data, error } = await supabase.from('packages').insert(pkg).select().single()
    if (error) throw error
    return data
  }

  static async updatePackage(id: string, updates: Partial<Package>): Promise<Package> {
    const { data, error } = await supabase.from('packages').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deletePackage(id: string): Promise<void> {
    const { error } = await supabase.from('packages').delete().eq('id', id)
    if (error) throw error
  }

  // Add-Ons
  static async getAddOns(): Promise<AddOn[]> {
    const { data, error } = await supabase.from('addons').select('*')
    if (error) throw error
    return data || []
  }

  static async createAddOn(addon: Omit<AddOn, 'id'>): Promise<AddOn> {
    const { data, error } = await supabase.from('addons').insert(addon).select().single()
    if (error) throw error
    return data
  }

  static async updateAddOn(id: string, updates: Partial<AddOn>): Promise<AddOn> {
    const { data, error } = await supabase.from('addons').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deleteAddOn(id: string): Promise<void> {
    const { error } = await supabase.from('addons').delete().eq('id', id)
    if (error) throw error
  }

  // Financial Pockets
  static async getFinancialPockets(): Promise<FinancialPocket[]> {
    const { data, error } = await supabase.from('financial_pockets').select('*')
    if (error) throw error
    return data || []
  }

  static async createFinancialPocket(pocket: Omit<FinancialPocket, 'id'>): Promise<FinancialPocket> {
    const { data, error } = await supabase.from('financial_pockets').insert(pocket).select().single()
    if (error) throw error
    return data
  }

  static async updateFinancialPocket(id: string, updates: Partial<FinancialPocket>): Promise<FinancialPocket> {
    const { data, error } = await supabase.from('financial_pockets').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deleteFinancialPocket(id: string): Promise<void> {
    const { error } = await supabase.from('financial_pockets').delete().eq('id', id)
    if (error) throw error
  }

  // Cards
  static async getCards(): Promise<Card[]> {
    const { data, error } = await supabase.from('cards').select('*')
    if (error) throw error
    return data || []
  }

  static async createCard(card: Omit<Card, 'id'>): Promise<Card> {
    const { data, error } = await supabase.from('cards').insert(card).select().single()
    if (error) throw error
    return data
  }

  static async updateCard(id: string, updates: Partial<Card>): Promise<Card> {
    const { data, error } = await supabase.from('cards').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deleteCard(id: string): Promise<void> {
    const { error } = await supabase.from('cards').delete().eq('id', id)
    if (error) throw error
  }

  // Leads
  static async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase.from('leads').select('*').order('date', { ascending: false })
    if (error) throw error
    return data || []
  }

  static async createLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
    const { data, error } = await supabase.from('leads').insert(lead).select().single()
    if (error) throw error
    return data
  }

  static async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deleteLead(id: string): Promise<void> {
    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (error) throw error
  }

  // Assets
  static async getAssets(): Promise<Asset[]> {
    const { data, error } = await supabase.from('assets').select('*')
    if (error) throw error
    return data || []
  }

  static async createAsset(asset: Omit<Asset, 'id'>): Promise<Asset> {
    const { data, error } = await supabase.from('assets').insert(asset).select().single()
    if (error) throw error
    return data
  }

  static async updateAsset(id: string, updates: Partial<Asset>): Promise<Asset> {
    const { data, error } = await supabase.from('assets').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deleteAsset(id: string): Promise<void> {
    const { error } = await supabase.from('assets').delete().eq('id', id)
    if (error) throw error
  }

  // Contracts
  static async getContracts(): Promise<Contract[]> {
    const { data, error } = await supabase.from('contracts').select('*')
    if (error) throw error
    return data || []
  }

  static async createContract(contract: Omit<Contract, 'id'>): Promise<Contract> {
    const { data, error } = await supabase.from('contracts').insert(contract).select().single()
    if (error) throw error
    return data
  }

  static async updateContract(id: string, updates: Partial<Contract>): Promise<Contract> {
    const { data, error } = await supabase.from('contracts').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deleteContract(id: string): Promise<void> {
    const { error } = await supabase.from('contracts').delete().eq('id', id)
    if (error) throw error
  }

  // Profile
  static async getProfile(): Promise<Profile | null> {
    const { data, error } = await supabase.from('profile').select('*').single()
    if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
    return data
  }

  static async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase.from('profile').upsert(updates).select().single()
    if (error) throw error
    return data
  }

  // Notifications
  static async getNotifications(): Promise<Notification[]> {
    const { data, error } = await supabase.from('notifications').select('*').order('timestamp', { ascending: false })
    if (error) throw error
    return data || []
  }

  static async createNotification(notification: Omit<Notification, 'id'>): Promise<Notification> {
    const { data, error } = await supabase.from('notifications').insert(notification).select().single()
    if (error) throw error
    return data
  }

  static async updateNotification(id: string, updates: Partial<Notification>): Promise<Notification> {
    const { data, error } = await supabase.from('notifications').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deleteNotification(id: string): Promise<void> {
    const { error } = await supabase.from('notifications').delete().eq('id', id)
    if (error) throw error
  }

  // SOPs
  static async getSOPs(): Promise<SOP[]> {
    const { data, error } = await supabase.from('sops').select('*').order('lastUpdated', { ascending: false })
    if (error) throw error
    return data || []
  }

  static async createSOP(sop: Omit<SOP, 'id'>): Promise<SOP> {
    const { data, error } = await supabase.from('sops').insert(sop).select().single()
    if (error) throw error
    return data
  }

  static async updateSOP(id: string, updates: Partial<SOP>): Promise<SOP> {
    const { data, error } = await supabase.from('sops').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deleteSOP(id: string): Promise<void> {
    const { error } = await supabase.from('sops').delete().eq('id', id)
    if (error) throw error
  }

  // Promo Codes
  static async getPromoCodes(): Promise<PromoCode[]> {
    const { data, error } = await supabase.from('promo_codes').select('*').order('createdAt', { ascending: false })
    if (error) throw error
    return data || []
  }

  static async createPromoCode(promoCode: Omit<PromoCode, 'id'>): Promise<PromoCode> {
    const { data, error } = await supabase.from('promo_codes').insert(promoCode).select().single()
    if (error) throw error
    return data
  }

  static async updatePromoCode(id: string, updates: Partial<PromoCode>): Promise<PromoCode> {
    const { data, error } = await supabase.from('promo_codes').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deletePromoCode(id: string): Promise<void> {
    const { error } = await supabase.from('promo_codes').delete().eq('id', id)
    if (error) throw error
  }

  // Social Media Posts
  static async getSocialMediaPosts(): Promise<SocialMediaPost[]> {
    const { data, error } = await supabase.from('social_media_posts').select('*').order('scheduledDate', { ascending: false })
    if (error) throw error
    return data || []
  }

  static async createSocialMediaPost(post: Omit<SocialMediaPost, 'id'>): Promise<SocialMediaPost> {
    const { data, error } = await supabase.from('social_media_posts').insert(post).select().single()
    if (error) throw error
    return data
  }

  static async updateSocialMediaPost(id: string, updates: Partial<SocialMediaPost>): Promise<SocialMediaPost> {
    const { data, error } = await supabase.from('social_media_posts').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  static async deleteSocialMediaPost(id: string): Promise<void> {
    const { error } = await supabase.from('social_media_posts').delete().eq('id', id)
    if (error) throw error
  }

  // Client Feedback
  static async getClientFeedback(): Promise<ClientFeedback[]> {
    const { data, error } = await supabase.from('client_feedback').select('*').order('date', { ascending: false })
    if (error) throw error
    return data || []
  }

  static async createClientFeedback(feedback: Omit<ClientFeedback, 'id'>): Promise<ClientFeedback> {
    const { data, error } = await supabase.from('client_feedback').insert(feedback).select().single()
    if (error) throw error
    return data
  }

  // Team Project Payments
  static async getTeamProjectPayments(): Promise<TeamProjectPayment[]> {
    const { data, error } = await supabase.from('team_project_payments').select('*')
    if (error) throw error
    return data || []
  }

  static async createTeamProjectPayment(payment: Omit<TeamProjectPayment, 'id'>): Promise<TeamProjectPayment> {
    const { data, error } = await supabase.from('team_project_payments').insert(payment).select().single()
    if (error) throw error
    return data
  }

  static async updateTeamProjectPayment(id: string, updates: Partial<TeamProjectPayment>): Promise<TeamProjectPayment> {
    const { data, error } = await supabase.from('team_project_payments').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  // Team Payment Records
  static async getTeamPaymentRecords(): Promise<TeamPaymentRecord[]> {
    const { data, error } = await supabase.from('team_payment_records').select('*').order('date', { ascending: false })
    if (error) throw error
    return data || []
  }

  static async createTeamPaymentRecord(record: Omit<TeamPaymentRecord, 'id'>): Promise<TeamPaymentRecord> {
    const { data, error } = await supabase.from('team_payment_records').insert(record).select().single()
    if (error) throw error
    return data
  }

  static async updateTeamPaymentRecord(id: string, updates: Partial<TeamPaymentRecord>): Promise<TeamPaymentRecord> {
    const { data, error } = await supabase.from('team_payment_records').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  // Reward Ledger Entries
  static async getRewardLedgerEntries(): Promise<RewardLedgerEntry[]> {
    const { data, error } = await supabase.from('reward_ledger_entries').select('*').order('date', { ascending: false })
    if (error) throw error
    return data || []
  }

  static async createRewardLedgerEntry(entry: Omit<RewardLedgerEntry, 'id'>): Promise<RewardLedgerEntry> {
    const { data, error } = await supabase.from('reward_ledger_entries').insert(entry).select().single()
    if (error) throw error
    return data
  }
}
