
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    full_name VARCHAR NOT NULL,
    role VARCHAR NOT NULL DEFAULT 'Member',
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    email VARCHAR,
    phone VARCHAR,
    since DATE NOT NULL,
    instagram VARCHAR,
    status VARCHAR NOT NULL DEFAULT 'ACTIVE',
    client_type VARCHAR NOT NULL DEFAULT 'DIRECT',
    last_contact DATE,
    portal_access_id VARCHAR UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Packages table
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    price BIGINT NOT NULL,
    photographers VARCHAR,
    videographers VARCHAR,
    physical_items JSONB DEFAULT '[]',
    digital_items JSONB DEFAULT '[]',
    processing_time VARCHAR,
    default_printing_cost BIGINT DEFAULT 0,
    default_transport_cost BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add-ons table
CREATE TABLE addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    price BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    email VARCHAR,
    phone VARCHAR,
    standard_fee BIGINT DEFAULT 0,
    no_rek VARCHAR,
    reward_balance BIGINT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    performance_notes JSONB DEFAULT '[]',
    portal_access_id VARCHAR UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR NOT NULL,
    client_name VARCHAR NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    project_type VARCHAR NOT NULL,
    package_name VARCHAR,
    package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
    add_ons JSONB DEFAULT '[]',
    date DATE NOT NULL,
    deadline_date DATE,
    location VARCHAR,
    progress INTEGER DEFAULT 0,
    status VARCHAR NOT NULL DEFAULT 'Tertunda',
    active_sub_statuses JSONB DEFAULT '[]',
    confirmed_sub_statuses JSONB DEFAULT '[]',
    client_sub_status_notes JSONB DEFAULT '{}',
    total_cost BIGINT NOT NULL,
    amount_paid BIGINT DEFAULT 0,
    payment_status VARCHAR NOT NULL DEFAULT 'BELUM_BAYAR',
    team JSONB DEFAULT '[]',
    dp_proof_url TEXT,
    final_drive_link TEXT,
    is_editing_confirmed_by_client BOOLEAN DEFAULT FALSE,
    is_printing_confirmed_by_client BOOLEAN DEFAULT FALSE,
    is_delivery_confirmed_by_client BOOLEAN DEFAULT FALSE,
    shipping_details TEXT,
    invoice_signature TEXT,
    revisions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cards table
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_holder_name VARCHAR NOT NULL,
    bank_name VARCHAR NOT NULL,
    card_type VARCHAR NOT NULL,
    last_four_digits VARCHAR NOT NULL,
    expiry_date VARCHAR,
    balance BIGINT DEFAULT 0,
    color_gradient VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Pockets table
CREATE TABLE financial_pockets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    description TEXT,
    icon VARCHAR,
    type VARCHAR NOT NULL,
    amount BIGINT DEFAULT 0,
    goal_amount BIGINT,
    lock_end_date DATE,
    source_card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    description TEXT NOT NULL,
    amount BIGINT NOT NULL,
    type VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    method VARCHAR NOT NULL,
    card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
    pocket_id UUID REFERENCES financial_pockets(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    vendor_signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    contact_channel VARCHAR NOT NULL,
    location VARCHAR,
    status VARCHAR NOT NULL DEFAULT 'DISCUSSION',
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    purchase_date DATE,
    purchase_price BIGINT,
    serial_number VARCHAR,
    status VARCHAR NOT NULL DEFAULT 'AVAILABLE',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contracts table
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_number VARCHAR NOT NULL UNIQUE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    signing_date DATE NOT NULL,
    signing_location VARCHAR,
    client_name1 VARCHAR NOT NULL,
    client_address1 TEXT,
    client_phone1 VARCHAR,
    client_name2 VARCHAR,
    client_address2 TEXT,
    client_phone2 VARCHAR,
    shooting_duration VARCHAR,
    guaranteed_photos VARCHAR,
    album_details TEXT,
    digital_files_format VARCHAR,
    other_items TEXT,
    personnel_count VARCHAR,
    delivery_timeframe VARCHAR,
    dp_date DATE,
    final_payment_date DATE,
    cancellation_policy TEXT,
    jurisdiction VARCHAR,
    vendor_signature TEXT,
    client_signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client Feedback table
CREATE TABLE client_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR NOT NULL,
    satisfaction VARCHAR NOT NULL,
    rating INTEGER NOT NULL,
    feedback TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Project Payments table
CREATE TABLE team_project_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    team_member_name VARCHAR NOT NULL,
    team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'Unpaid',
    fee BIGINT NOT NULL,
    reward BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Payment Records table
CREATE TABLE team_payment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_number VARCHAR NOT NULL UNIQUE,
    team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    project_payment_ids JSONB DEFAULT '[]',
    total_amount BIGINT NOT NULL,
    vendor_signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reward Ledger Entries table
CREATE TABLE reward_ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    amount BIGINT NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    icon VARCHAR NOT NULL,
    link JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Posts table
CREATE TABLE social_media_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    client_name VARCHAR NOT NULL,
    post_type VARCHAR NOT NULL,
    platform VARCHAR NOT NULL,
    scheduled_date DATE NOT NULL,
    caption TEXT,
    media_url TEXT,
    status VARCHAR NOT NULL DEFAULT 'DRAFT',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promo Codes table
CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR NOT NULL UNIQUE,
    discount_type VARCHAR NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    max_usage INTEGER,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SOPs table
CREATE TABLE sops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    content TEXT NOT NULL,
    last_updated DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile table (singleton)
CREATE TABLE profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    company_name VARCHAR,
    website VARCHAR,
    address TEXT,
    bank_account VARCHAR,
    authorized_signer VARCHAR,
    id_number VARCHAR,
    bio TEXT,
    income_categories JSONB DEFAULT '[]',
    expense_categories JSONB DEFAULT '[]',
    project_types JSONB DEFAULT '[]',
    event_types JSONB DEFAULT '[]',
    asset_categories JSONB DEFAULT '[]',
    sop_categories JSONB DEFAULT '[]',
    project_status_config JSONB DEFAULT '[]',
    notification_settings JSONB DEFAULT '{}',
    security_settings JSONB DEFAULT '{}',
    briefing_template TEXT,
    terms_and_conditions TEXT,
    contract_template TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_portal_access ON clients(portal_access_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_date ON projects(date);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_project_id ON transactions(project_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_leads_date ON leads(date);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_team_members_portal_access ON team_members(portal_access_id);
CREATE INDEX idx_notifications_timestamp ON notifications(timestamp);
CREATE INDEX idx_social_media_posts_scheduled_date ON social_media_posts(scheduled_date);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addons_updated_at BEFORE UPDATE ON addons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_pockets_updated_at BEFORE UPDATE ON financial_pockets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_feedback_updated_at BEFORE UPDATE ON client_feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_project_payments_updated_at BEFORE UPDATE ON team_project_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_payment_records_updated_at BEFORE UPDATE ON team_payment_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reward_ledger_entries_updated_at BEFORE UPDATE ON reward_ledger_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_media_posts_updated_at BEFORE UPDATE ON social_media_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sops_updated_at BEFORE UPDATE ON sops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
