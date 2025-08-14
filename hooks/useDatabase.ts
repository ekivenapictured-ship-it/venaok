
import { useState, useEffect } from 'react'
import { DatabaseService } from '../lib/database'
import { 
  User, Client, Project, TeamMember, Transaction, Package, AddOn, 
  FinancialPocket, Card, Asset, Contract, ClientFeedback, Lead, 
  RewardLedgerEntry, TeamProjectPayment, TeamPaymentRecord, 
  Notification, SocialMediaPost, PromoCode, SOP, Profile
} from '../types'

export function useDatabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: any) => {
    console.error('Database error:', err)
    setError(err.message || 'An error occurred')
    setIsLoading(false)
  }

  const executeOperation = async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await operation()
      setIsLoading(false)
      return result
    } catch (err) {
      handleError(err)
      return null
    }
  }

  // Users operations
  const getUsers = () => executeOperation(() => DatabaseService.getUsers())
  const createUser = (user: Omit<User, 'id'>) => executeOperation(() => DatabaseService.createUser(user))
  const updateUser = (id: string, updates: Partial<User>) => executeOperation(() => DatabaseService.updateUser(id, updates))
  const deleteUser = (id: string) => executeOperation(() => DatabaseService.deleteUser(id))

  // Clients operations
  const getClients = () => executeOperation(() => DatabaseService.getClients())
  const createClient = (client: Omit<Client, 'id'>) => executeOperation(() => DatabaseService.createClient(client))
  const updateClient = (id: string, updates: Partial<Client>) => executeOperation(() => DatabaseService.updateClient(id, updates))
  const deleteClient = (id: string) => executeOperation(() => DatabaseService.deleteClient(id))

  // Projects operations
  const getProjects = () => executeOperation(() => DatabaseService.getProjects())
  const createProject = (project: Omit<Project, 'id'>) => executeOperation(() => DatabaseService.createProject(project))
  const updateProject = (id: string, updates: Partial<Project>) => executeOperation(() => DatabaseService.updateProject(id, updates))
  const deleteProject = (id: string) => executeOperation(() => DatabaseService.deleteProject(id))

  // Team Members operations
  const getTeamMembers = () => executeOperation(() => DatabaseService.getTeamMembers())
  const createTeamMember = (member: Omit<TeamMember, 'id'>) => executeOperation(() => DatabaseService.createTeamMember(member))
  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => executeOperation(() => DatabaseService.updateTeamMember(id, updates))
  const deleteTeamMember = (id: string) => executeOperation(() => DatabaseService.deleteTeamMember(id))

  // Transactions operations
  const getTransactions = () => executeOperation(() => DatabaseService.getTransactions())
  const createTransaction = (transaction: Omit<Transaction, 'id'>) => executeOperation(() => DatabaseService.createTransaction(transaction))
  const updateTransaction = (id: string, updates: Partial<Transaction>) => executeOperation(() => DatabaseService.updateTransaction(id, updates))
  const deleteTransaction = (id: string) => executeOperation(() => DatabaseService.deleteTransaction(id))

  // Packages operations
  const getPackages = () => executeOperation(() => DatabaseService.getPackages())
  const createPackage = (pkg: Omit<Package, 'id'>) => executeOperation(() => DatabaseService.createPackage(pkg))
  const updatePackage = (id: string, updates: Partial<Package>) => executeOperation(() => DatabaseService.updatePackage(id, updates))
  const deletePackage = (id: string) => executeOperation(() => DatabaseService.deletePackage(id))

  // Add-ons operations
  const getAddOns = () => executeOperation(() => DatabaseService.getAddOns())
  const createAddOn = (addon: Omit<AddOn, 'id'>) => executeOperation(() => DatabaseService.createAddOn(addon))
  const updateAddOn = (id: string, updates: Partial<AddOn>) => executeOperation(() => DatabaseService.updateAddOn(id, updates))
  const deleteAddOn = (id: string) => executeOperation(() => DatabaseService.deleteAddOn(id))

  // Financial Pockets operations
  const getFinancialPockets = () => executeOperation(() => DatabaseService.getFinancialPockets())
  const createFinancialPocket = (pocket: Omit<FinancialPocket, 'id'>) => executeOperation(() => DatabaseService.createFinancialPocket(pocket))
  const updateFinancialPocket = (id: string, updates: Partial<FinancialPocket>) => executeOperation(() => DatabaseService.updateFinancialPocket(id, updates))
  const deleteFinancialPocket = (id: string) => executeOperation(() => DatabaseService.deleteFinancialPocket(id))

  // Cards operations
  const getCards = () => executeOperation(() => DatabaseService.getCards())
  const createCard = (card: Omit<Card, 'id'>) => executeOperation(() => DatabaseService.createCard(card))
  const updateCard = (id: string, updates: Partial<Card>) => executeOperation(() => DatabaseService.updateCard(id, updates))
  const deleteCard = (id: string) => executeOperation(() => DatabaseService.deleteCard(id))

  // Leads operations
  const getLeads = () => executeOperation(() => DatabaseService.getLeads())
  const createLead = (lead: Omit<Lead, 'id'>) => executeOperation(() => DatabaseService.createLead(lead))
  const updateLead = (id: string, updates: Partial<Lead>) => executeOperation(() => DatabaseService.updateLead(id, updates))
  const deleteLead = (id: string) => executeOperation(() => DatabaseService.deleteLead(id))

  // Assets operations
  const getAssets = () => executeOperation(() => DatabaseService.getAssets())
  const createAsset = (asset: Omit<Asset, 'id'>) => executeOperation(() => DatabaseService.createAsset(asset))
  const updateAsset = (id: string, updates: Partial<Asset>) => executeOperation(() => DatabaseService.updateAsset(id, updates))
  const deleteAsset = (id: string) => executeOperation(() => DatabaseService.deleteAsset(id))

  // Contracts operations
  const getContracts = () => executeOperation(() => DatabaseService.getContracts())
  const createContract = (contract: Omit<Contract, 'id'>) => executeOperation(() => DatabaseService.createContract(contract))
  const updateContract = (id: string, updates: Partial<Contract>) => executeOperation(() => DatabaseService.updateContract(id, updates))
  const deleteContract = (id: string) => executeOperation(() => DatabaseService.deleteContract(id))

  // Profile operations
  const getProfile = () => executeOperation(() => DatabaseService.getProfile())
  const updateProfile = (updates: Partial<Profile>) => executeOperation(() => DatabaseService.updateProfile(updates))

  // Notifications operations
  const getNotifications = () => executeOperation(() => DatabaseService.getNotifications())
  const createNotification = (notification: Omit<Notification, 'id'>) => executeOperation(() => DatabaseService.createNotification(notification))
  const updateNotification = (id: string, updates: Partial<Notification>) => executeOperation(() => DatabaseService.updateNotification(id, updates))
  const deleteNotification = (id: string) => executeOperation(() => DatabaseService.deleteNotification(id))

  // SOPs operations
  const getSOPs = () => executeOperation(() => DatabaseService.getSOPs())
  const createSOP = (sop: Omit<SOP, 'id'>) => executeOperation(() => DatabaseService.createSOP(sop))
  const updateSOP = (id: string, updates: Partial<SOP>) => executeOperation(() => DatabaseService.updateSOP(id, updates))
  const deleteSOP = (id: string) => executeOperation(() => DatabaseService.deleteSOP(id))

  // Promo Codes operations
  const getPromoCodes = () => executeOperation(() => DatabaseService.getPromoCodes())
  const createPromoCode = (promoCode: Omit<PromoCode, 'id'>) => executeOperation(() => DatabaseService.createPromoCode(promoCode))
  const updatePromoCode = (id: string, updates: Partial<PromoCode>) => executeOperation(() => DatabaseService.updatePromoCode(id, updates))
  const deletePromoCode = (id: string) => executeOperation(() => DatabaseService.deletePromoCode(id))

  // Social Media Posts operations
  const getSocialMediaPosts = () => executeOperation(() => DatabaseService.getSocialMediaPosts())
  const createSocialMediaPost = (post: Omit<SocialMediaPost, 'id'>) => executeOperation(() => DatabaseService.createSocialMediaPost(post))
  const updateSocialMediaPost = (id: string, updates: Partial<SocialMediaPost>) => executeOperation(() => DatabaseService.updateSocialMediaPost(id, updates))
  const deleteSocialMediaPost = (id: string) => executeOperation(() => DatabaseService.deleteSocialMediaPost(id))

  // Client Feedback operations
  const getClientFeedback = () => executeOperation(() => DatabaseService.getClientFeedback())
  const createClientFeedback = (feedback: Omit<ClientFeedback, 'id'>) => executeOperation(() => DatabaseService.createClientFeedback(feedback))

  // Team Project Payments operations
  const getTeamProjectPayments = () => executeOperation(() => DatabaseService.getTeamProjectPayments())
  const createTeamProjectPayment = (payment: Omit<TeamProjectPayment, 'id'>) => executeOperation(() => DatabaseService.createTeamProjectPayment(payment))
  const updateTeamProjectPayment = (id: string, updates: Partial<TeamProjectPayment>) => executeOperation(() => DatabaseService.updateTeamProjectPayment(id, updates))

  // Team Payment Records operations
  const getTeamPaymentRecords = () => executeOperation(() => DatabaseService.getTeamPaymentRecords())
  const createTeamPaymentRecord = (record: Omit<TeamPaymentRecord, 'id'>) => executeOperation(() => DatabaseService.createTeamPaymentRecord(record))
  const updateTeamPaymentRecord = (id: string, updates: Partial<TeamPaymentRecord>) => executeOperation(() => DatabaseService.updateTeamPaymentRecord(id, updates))

  // Reward Ledger Entries operations
  const getRewardLedgerEntries = () => executeOperation(() => DatabaseService.getRewardLedgerEntries())
  const createRewardLedgerEntry = (entry: Omit<RewardLedgerEntry, 'id'>) => executeOperation(() => DatabaseService.createRewardLedgerEntry(entry))

  return {
    isLoading,
    error,
    // Users
    getUsers, createUser, updateUser, deleteUser,
    // Clients
    getClients, createClient, updateClient, deleteClient,
    // Projects
    getProjects, createProject, updateProject, deleteProject,
    // Team Members
    getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember,
    // Transactions
    getTransactions, createTransaction, updateTransaction, deleteTransaction,
    // Packages
    getPackages, createPackage, updatePackage, deletePackage,
    // Add-ons
    getAddOns, createAddOn, updateAddOn, deleteAddOn,
    // Financial Pockets
    getFinancialPockets, createFinancialPocket, updateFinancialPocket, deleteFinancialPocket,
    // Cards
    getCards, createCard, updateCard, deleteCard,
    // Leads
    getLeads, createLead, updateLead, deleteLead,
    // Assets
    getAssets, createAsset, updateAsset, deleteAsset,
    // Contracts
    getContracts, createContract, updateContract, deleteContract,
    // Profile
    getProfile, updateProfile,
    // Notifications
    getNotifications, createNotification, updateNotification, deleteNotification,
    // SOPs
    getSOPs, createSOP, updateSOP, deleteSOP,
    // Promo Codes
    getPromoCodes, createPromoCode, updatePromoCode, deletePromoCode,
    // Social Media Posts
    getSocialMediaPosts, createSocialMediaPost, updateSocialMediaPost, deleteSocialMediaPost,
    // Client Feedback
    getClientFeedback, createClientFeedback,
    // Team Project Payments
    getTeamProjectPayments, createTeamProjectPayment, updateTeamProjectPayment,
    // Team Payment Records
    getTeamPaymentRecords, createTeamPaymentRecord, updateTeamPaymentRecord,
    // Reward Ledger Entries
    getRewardLedgerEntries, createRewardLedgerEntry,
  }
}
