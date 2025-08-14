import React, { useState, useEffect } from 'react';
import { ViewType, User, Client, Project, TeamMember, Transaction, Package, AddOn, FinancialPocket, Card, Asset, Contract, Lead, Notification, SocialMediaPost, PromoCode, SOP, Profile } from './types';
import { useDatabase } from './hooks/useDatabase';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Leads from './components/Leads';
import Clients from './components/Clients';
import Projects from './components/Projects';
import Freelancers from './components/Freelancers';
import Finance from './components/Finance';
import CalendarView from './components/CalendarView';
import ClientReports from './components/ClientReports';
import Packages from './components/Packages';
import PromoCodes from './components/PromoCodes';
import Assets from './components/Assets';
import Contracts from './components/Contracts';
import SOP from './components/SOP';
import SocialPlanner from './components/SocialPlanner';
import Settings from './components/Settings';
import Login from './components/Login';
import DataMigration from './components/DataMigration';

// Public Components
import PublicFeedbackForm from './components/PublicFeedbackForm';
import FreelancerPortal from './components/FreelancerPortal';
import ClientPortal from './components/ClientPortal';
import PublicBookingForm from './components/PublicBookingForm';
import PublicLeadForm from './components/PublicLeadForm';
import PublicRevisionForm from './components/PublicRevisionForm';
import SuggestionForm from './components/SuggestionForm';
import PublicClientReport from './components/PublicClientReport';
import PublicSignaturePad from './components/PublicSignaturePad';

const MOCK_CURRENT_USER: User = {
  id: 'USR001',
  fullName: 'Admin Vena Pictures',
  email: 'admin@venapictures.com',
  password: 'admin123',
  role: 'Admin'
};

const App: React.FC = () => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_CURRENT_USER);

  // Navigation state
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [financialPockets, setFinancialPockets] = useState<FinancialPocket[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [sops, setSOPs] = useState<SOP[]>([]);
  const [profile, setProfile] = useState<Profile>({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    website: '',
    address: '',
    bankAccount: '',
    authorizedSigner: '',
    bio: '',
    incomeCategories: [],
    expenseCategories: [],
    projectTypes: [],
    eventTypes: [],
    assetCategories: [],
    sopCategories: [],
    projectStatusConfig: [],
    notificationSettings: { newProject: true, paymentConfirmation: true, deadlineReminder: true },
    securitySettings: { twoFactorEnabled: false },
    briefingTemplate: '',
    termsAndConditions: '',
    contractTemplate: ''
  });

  // Mock data for clientFeedback, teamProjectPayments, teamPaymentRecords, rewardLedgerEntries, showNotification, handleUpdateRevision, setClientFeedback, handleClientConfirmation, handleClientSubStatusConfirmation, handleSignContract
  const [clientFeedback, setClientFeedback] = useState<any[]>([]);
  const [teamProjectPayments, setTeamProjectPayments] = useState<any[]>([]);
  const [teamPaymentRecords, setTeamPaymentRecords] = useState<any[]>([]);
  const [rewardLedgerEntries, setRewardLedgerEntries] = useState<any[]>([]);
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => { console.log(`Notification: ${type} - ${message}`); };
  const handleUpdateRevision = (projectId: string, status: string) => { console.log(`Updating revision for project ${projectId} to ${status}`); };
  const handleClientConfirmation = (clientId: string) => { console.log(`Confirming client ${clientId}`); };
  const handleClientSubStatusConfirmation = (clientId: string, subStatus: string) => { console.log(`Confirming sub-status for client ${clientId} to ${subStatus}`); };
  const handleSignContract = (clientId: string) => { console.log(`Signing contract for client ${clientId}`); };

  const database = useDatabase();

  // Load data from Supabase on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Load all data from Supabase
      const [
        usersData,
        clientsData,
        projectsData,
        teamMembersData,
        transactionsData,
        packagesData,
        addOnsData,
        financialPocketsData,
        cardsData,
        assetsData,
        contractsData,
        leadsData,
        notificationsData,
        socialMediaPostsData,
        promoCodesData,
        sopsData,
        profileData
      ] = await Promise.all([
        database.getUsers(),
        database.getClients(),
        database.getProjects(),
        database.getTeamMembers(),
        database.getTransactions(),
        database.getPackages(),
        database.getAddOns(),
        database.getFinancialPockets(),
        database.getCards(),
        database.getAssets(),
        database.getContracts(),
        database.getLeads(),
        database.getNotifications(),
        database.getSocialMediaPosts(),
        database.getPromoCodes(),
        database.getSOPs(),
        database.getProfile()
      ]);

      // Set all data to state
      if (usersData) setUsers(usersData);
      if (clientsData) setClients(clientsData);
      if (projectsData) setProjects(projectsData);
      if (teamMembersData) setTeamMembers(teamMembersData);
      if (transactionsData) setTransactions(transactionsData);
      if (packagesData) setPackages(packagesData);
      if (addOnsData) setAddOns(addOnsData);
      if (financialPocketsData) setFinancialPockets(financialPocketsData);
      if (cardsData) setCards(cardsData);
      if (assetsData) setAssets(assetsData);
      if (contractsData) setContracts(contractsData);
      if (leadsData) setLeads(leadsData);
      if (notificationsData) setNotifications(notificationsData);
      if (socialMediaPostsData) setSocialMediaPosts(socialMediaPostsData);
      if (promoCodesData) setPromoCodes(promoCodesData);
      if (sopsData) setSOPs(sopsData);
      if (profileData) setProfile(prev => ({ ...prev, ...profileData }));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Helper function to refresh specific data
  const refreshData = {
    users: async () => {
      const data = await database.getUsers();
      if (data) setUsers(data);
    },
    clients: async () => {
      const data = await database.getClients();
      if (data) setClients(data);
    },
    projects: async () => {
      const data = await database.getProjects();
      if (data) setProjects(data);
    },
    teamMembers: async () => {
      const data = await database.getTeamMembers();
      if (data) setTeamMembers(data);
    },
    transactions: async () => {
      const data = await database.getTransactions();
      if (data) setTransactions(data);
    },
    packages: async () => {
      const data = await database.getPackages();
      if (data) setPackages(data);
    },
    addOns: async () => {
      const data = await database.getAddOns();
      if (data) setAddOns(data);
    },
    financialPockets: async () => {
      const data = await database.getFinancialPockets();
      if (data) setFinancialPockets(data);
    },
    cards: async () => {
      const data = await database.getCards();
      if (data) setCards(data);
    },
    assets: async () => {
      const data = await database.getAssets();
      if (data) setAssets(data);
    },
    contracts: async () => {
      const data = await database.getContracts();
      if (data) setContracts(data);
    },
    leads: async () => {
      const data = await database.getLeads();
      if (data) setLeads(data);
    },
    notifications: async () => {
      const data = await database.getNotifications();
      if (data) setNotifications(data);
    },
    socialMediaPosts: async () => {
      const data = await database.getSocialMediaPosts();
      if (data) setSocialMediaPosts(data);
    },
    promoCodes: async () => {
      const data = await database.getPromoCodes();
      if (data) setPromoCodes(data);
    },
    sops: async () => {
      const data = await database.getSOPs();
      if (data) setSOPs(data);
    },
    profile: async () => {
      const data = await database.getProfile();
      if (data) setProfile(prev => ({ ...prev, ...data }));
    }
  };

  // Route detection for public pages
  const currentPath = window.location.hash.slice(1) || window.location.pathname;
  const hash = window.location.hash;

  // Public routes
  if (currentPath === '/feedback') {
    return <PublicFeedbackForm setLeads={setLeads} />;
  }
  if (currentPath === '/freelancer-portal') {
    return <FreelancerPortal teamMembers={teamMembers} projects={projects} />;
  }
  if (currentPath === '/client-portal') {
    return <ClientPortal clients={clients} projects={projects} />;
  }
  if (currentPath === '/booking') {
    return <PublicBookingForm packages={packages} addOns={addOns} setLeads={setLeads} />;
  }
  if (currentPath === '/lead-form') {
    return <PublicLeadForm setLeads={setLeads} />;
  }
  if (currentPath === '/revision') {
    return <PublicRevisionForm projects={projects} />;
  }
  if (currentPath === '/suggestion') {
    return <SuggestionForm setLeads={setLeads} />;
  }

  // New public routes based on the changes
  if (hash.startsWith('#/client-report/')) {
    return <PublicClientReport clientId={hash.split('/')[2]} clients={clients} projects={projects} transactions={transactions} feedback={clientFeedback} profile={profile} packages={packages} />;
  }
  if (hash.startsWith('#/signature-pad')) {
    return <PublicSignaturePad />;
  }


  // Authentication check for private routes
  if (!isLoggedIn) {
    return <Login onLogin={setIsLoggedIn} setCurrentUser={setCurrentUser} users={users} />;
  }

  // Permission check function
  const hasPermission = (view: ViewType): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'Admin') return true;
    if (view === ViewType.DASHBOARD || view === ViewType.SETTINGS) return true;
    return currentUser.permissions?.includes(view) || false;
  };

  const renderContent = () => {
    if (!hasPermission(currentView)) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-brand-text-light mb-2">Akses Ditolak</h2>
            <p className="text-brand-text-secondary">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case ViewType.DASHBOARD:
        return (
          <Dashboard
            clients={clients}
            projects={projects}
            transactions={transactions}
            teamMembers={teamMembers}
            leads={leads}
            notifications={notifications}
          />
        );
      case ViewType.LEADS:
        return (
          <Leads
            leads={leads}
            setLeads={setLeads}
            database={database}
            refreshData={refreshData.leads}
          />
        );
      case ViewType.CLIENTS:
        return (
          <Clients
            clients={clients}
            setClients={setClients}
            projects={projects}
            database={database}
            refreshData={refreshData.clients}
          />
        );
      case ViewType.PROJECTS:
        return (
          <Projects
            projects={projects}
            setProjects={setProjects}
            clients={clients}
            packages={packages}
            addOns={addOns}
            teamMembers={teamMembers}
            profile={profile}
            database={database}
            refreshData={refreshData.projects}
          />
        );
      case ViewType.FREELANCERS:
        return (
          <Freelancers
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
            projects={projects}
            database={database}
            refreshData={refreshData.teamMembers}
          />
        );
      case ViewType.FINANCE:
        return (
          <Finance
            transactions={transactions}
            setTransactions={setTransactions}
            projects={projects}
            financialPockets={financialPockets}
            setFinancialPockets={setFinancialPockets}
            cards={cards}
            setCards={setCards}
            profile={profile}
            database={database}
            refreshData={{
              transactions: refreshData.transactions,
              financialPockets: refreshData.financialPockets,
              cards: refreshData.cards
            }}
          />
        );
      case ViewType.CALENDAR:
        return (
          <CalendarView
            projects={projects}
            setProjects={setProjects}
            profile={profile}
            database={database}
            refreshData={refreshData.projects}
          />
        );
      case ViewType.CLIENT_REPORTS:
        return (
          <ClientReports
            projects={projects}
            clients={clients}
            database={database}
          />
        );
      case ViewType.PACKAGES:
        return (
          <Packages
            packages={packages}
            setPackages={setPackages}
            addOns={addOns}
            setAddOns={setAddOns}
            database={database}
            refreshData={{
              packages: refreshData.packages,
              addOns: refreshData.addOns
            }}
          />
        );
      case ViewType.PROMO_CODES:
        return (
          <PromoCodes
            promoCodes={promoCodes}
            setPromoCodes={setPromoCodes}
            database={database}
            refreshData={refreshData.promoCodes}
          />
        );
      case ViewType.ASSETS:
        return (
          <Assets
            assets={assets}
            setAssets={setAssets}
            profile={profile}
            database={database}
            refreshData={refreshData.assets}
          />
        );
      case ViewType.CONTRACTS:
        return (
          <Contracts
            contracts={contracts}
            setContracts={setContracts}
            clients={clients}
            projects={projects}
            profile={profile}
            database={database}
            refreshData={refreshData.contracts}
          />
        );
      case ViewType.SOP:
        return (
          <SOP
            sops={sops}
            setSOPs={setSOPs}
            profile={profile}
            database={database}
            refreshData={refreshData.sops}
          />
        );
      case ViewType.SOCIAL_PLANNER:
        return (
          <SocialPlanner
            socialMediaPosts={socialMediaPosts}
            setSocialMediaPosts={setSocialMediaPosts}
            projects={projects}
            database={database}
            refreshData={refreshData.socialMediaPosts}
          />
        );
      case ViewType.SETTINGS:
        return (
          <Settings
            profile={profile}
            setProfile={setProfile}
            transactions={transactions}
            projects={projects}
            users={users}
            setUsers={setUsers}
            currentUser={currentUser}
            database={database}
            refreshData={{
              users: refreshData.users,
              profile: refreshData.profile
            }}
          />
        );
      case ViewType.DATA_MIGRATION:
        return <DataMigration />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text-primary overflow-hidden">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        currentUser={currentUser}
        hasPermission={hasPermission}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          currentUser={currentUser}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentUser(null);
          }}
          notifications={notifications}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;