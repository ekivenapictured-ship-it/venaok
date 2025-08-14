
-- Import Mock Data to Supabase
-- This script inserts sample data for all tables

-- Insert Users
INSERT INTO users (id, email, password, full_name, role, permissions) VALUES
('USR001', 'admin@venapictures.com', 'admin123', 'Admin Vena Pictures', 'Admin', '[]'),
('USR002', 'member@venapictures.com', 'member123', 'Staff Member', 'Member', '["LEADS", "CLIENTS", "PROJECTS"]'),
('USR003', 'editor@venapictures.com', 'editor123', 'Video Editor', 'Member', '["PROJECTS", "SOCIAL_PLANNER"]');

-- Insert Clients
INSERT INTO clients (id, name, email, phone, since, instagram, status, client_type, portal_access_id) VALUES
('CLI001', 'Sarah & Ahmad Wedding', 'sarah.ahmad@email.com', '+62812345678', '2024-01-15', '@sarahahmadwedding', 'ACTIVE', 'DIRECT', 'CLI001-ACCESS'),
('CLI002', 'PT Teknologi Maju', 'info@teknologimaju.com', '+62213456789', '2024-02-20', '@teknologi_maju', 'ACTIVE', 'CORPORATE', 'CLI002-ACCESS'),
('CLI003', 'Budi & Sari Engagement', 'budi.sari@email.com', '+62856789012', '2024-03-10', '@budisari2024', 'INACTIVE', 'DIRECT', 'CLI003-ACCESS');

-- Insert Packages
INSERT INTO packages (id, name, price, photographers, videographers, physical_items, digital_items, processing_time, default_printing_cost, default_transport_cost) VALUES
('PKG001', 'Wedding Premium', 15000000, '2 Fotografer', '1 Videographer', '["Album 20x30 (50 halaman)", "Cetak foto 4R (100 lembar)"]', '["Semua foto hasil jepretan", "Video highlight 5-8 menit", "Raw video 30 menit"]', '14 hari kerja', 500000, 200000),
('PKG002', 'Corporate Basic', 8000000, '1 Fotografer', '1 Videographer', '["USB Flashdisk branded"]', '["Foto dokumentasi acara", "Video dokumentasi 10 menit"]', '7 hari kerja', 0, 100000),
('PKG003', 'Engagement Standard', 5000000, '1 Fotografer', '', '["Album mini 15x20 (20 halaman)"]', '["Foto prewedding", "Video cinematic 3 menit"]', '10 hari kerja', 300000, 150000);

-- Insert Team Members
INSERT INTO team_members (id, name, role, email, phone, standard_fee, reward_balance, rating, portal_access_id) VALUES
('TM001', 'Andi Photographer', 'Fotografer', 'andi@venapictures.com', '+62878901234', 800000, 50000, 4.8, 'TM001-ACCESS'),
('TM002', 'Budi Videographer', 'Videographer', 'budi@venapictures.com', '+62889012345', 1000000, 75000, 4.9, 'TM002-ACCESS'),
('TM003', 'Citra Editor', 'Editor', 'citra@venapictures.com', '+62890123456', 600000, 25000, 4.7, 'TM003-ACCESS');

-- Insert Cards
INSERT INTO cards (id, card_holder_name, bank_name, card_type, last_four_digits, balance, color_gradient) VALUES
('CARD001', 'Vena Pictures', 'Bank BCA', 'Rekening Tabungan', '1234', 25000000, 'from-blue-500 to-blue-700'),
('CARD002', 'Vena Pictures', 'Bank Mandiri', 'Rekening Bisnis', '5678', 15000000, 'from-yellow-500 to-orange-600'),
('CARD003', 'Petty Cash', 'Cash', 'Kas Kecil', '0000', 2000000, 'from-green-500 to-green-700');

-- Insert Financial Pockets
INSERT INTO financial_pockets (id, name, description, icon, type, amount, goal_amount, source_card_id) VALUES
('FP001', 'Dana Darurat', 'Dana untuk keperluan mendesak', '🚨', 'EMERGENCY', 5000000, 10000000, 'CARD001'),
('FP002', 'Upgrade Equipment', 'Tabungan untuk beli kamera baru', '📷', 'GOAL', 8000000, 20000000, 'CARD001'),
('FP003', 'Marketing Budget', 'Budget untuk promosi dan iklan', '📈', 'BUDGET', 3000000, 5000000, 'CARD002');

-- Insert Projects
INSERT INTO projects (id, project_name, client_name, client_id, project_type, package_name, package_id, date, location, status, total_cost, amount_paid, payment_status, team) VALUES
('PRJ001', 'Wedding Sarah & Ahmad', 'Sarah & Ahmad Wedding', 'CLI001', 'Wedding', 'Wedding Premium', 'PKG001', '2024-12-20', 'Hotel Grand Ballroom', 'Dalam Proses', 15000000, 7500000, 'DP_PAID', '[{"id": "TM001", "name": "Andi Photographer", "role": "Fotografer"}, {"id": "TM002", "name": "Budi Videographer", "role": "Videographer"}]'),
('PRJ002', 'Corporate Event PT Teknologi', 'PT Teknologi Maju', 'CLI002', 'Corporate', 'Corporate Basic', 'PKG002', '2024-12-25', 'Office Building', 'Tertunda', 8000000, 0, 'BELUM_BAYAR', '[{"id": "TM001", "name": "Andi Photographer", "role": "Fotografer"}]'),
('PRJ003', 'Engagement Budi & Sari', 'Budi & Sari Engagement', 'CLI003', 'Engagement', 'Engagement Standard', 'PKG003', '2024-11-15', 'Taman Kota', 'Selesai', 5000000, 5000000, 'PAID', '[{"id": "TM001", "name": "Andi Photographer", "role": "Fotografer"}]');

-- Insert Transactions
INSERT INTO transactions (id, date, description, amount, type, category, method, card_id, project_id) VALUES
('TXN001', '2024-11-01', 'DP Wedding Sarah & Ahmad', 7500000, 'Pemasukan', 'DP Proyek', 'Transfer Bank', 'CARD001', 'PRJ001'),
('TXN002', '2024-11-02', 'Gaji Freelancer Andi', -800000, 'Pengeluaran', 'Gaji Freelancer', 'Transfer Bank', 'CARD001', 'PRJ003'),
('TXN003', '2024-11-03', 'Pelunasan Engagement Budi & Sari', 2500000, 'Pemasukan', 'Pelunasan Proyek', 'Cash', 'CARD003', 'PRJ003'),
('TXN004', '2024-11-05', 'Beli Memory Card', -500000, 'Pengeluaran', 'Equipment', 'Debit Card', 'CARD002', NULL);

-- Insert Leads
INSERT INTO leads (id, name, contact_channel, location, status, date, notes) VALUES
('LEAD001', 'Rina Wedding Inquiry', 'Instagram DM', 'Jakarta', 'DISCUSSION', '2024-11-10', 'Menanyakan paket wedding untuk Mei 2025, budget 12-15 juta'),
('LEAD002', 'Corporate PT Maju Jaya', 'WhatsApp', 'Bandung', 'QUOTE_SENT', '2024-11-12', 'Butuh dokumentasi annual meeting, sudah kirim quotation'),
('LEAD003', 'Dedi Birthday Party', 'Website Form', 'Surabaya', 'DISCUSSION', '2024-11-14', 'Ulang tahun ke-30, budget terbatas sekitar 3 juta');

-- Insert Assets
INSERT INTO assets (id, name, category, purchase_date, purchase_price, status, notes) VALUES
('AST001', 'Canon EOS R5', 'Kamera', '2024-01-15', 45000000, 'AVAILABLE', 'Kamera utama untuk wedding'),
('AST002', 'Sony FX3', 'Kamera Video', '2024-02-20', 35000000, 'IN_USE', 'Sedang dipakai untuk project corporate'),
('AST003', 'Tripod Manfrotto', 'Aksesoris', '2024-03-10', 2500000, 'AVAILABLE', 'Tripod professional untuk video'),
('AST004', 'Drone DJI Mini 3', 'Drone', '2024-04-05', 8000000, 'MAINTENANCE', 'Perlu service rutin');

-- Insert SOPs
INSERT INTO sops (id, title, category, content, last_updated) VALUES
('SOP001', 'Prosedur Pemotretan Wedding', 'Wedding', 'Langkah-langkah detail untuk pemotretan pernikahan dari persiapan hingga selesai', '2024-11-01'),
('SOP002', 'Checklist Equipment Sebelum Shooting', 'Equipment', 'Daftar peralatan yang harus disiapkan sebelum berangkat shooting', '2024-10-25'),
('SOP003', 'Workflow Editing Video', 'Post-Production', 'Tahapan editing video dari raw footage hingga delivery final', '2024-11-05');

-- Insert Promo Codes
INSERT INTO promo_codes (id, code, discount_type, discount_value, is_active, usage_count, max_usage, expiry_date) VALUES
('PROMO001', 'WEDDING2024', 'PERCENTAGE', 10.00, true, 5, 50, '2024-12-31'),
('PROMO002', 'EARLYBIRD', 'FIXED', 500000.00, true, 2, 20, '2024-11-30'),
('PROMO003', 'CORPORATE15', 'PERCENTAGE', 15.00, false, 0, 10, '2024-12-15');

-- Insert Social Media Posts
INSERT INTO social_media_posts (id, project_id, client_name, post_type, platform, scheduled_date, caption, status, notes) VALUES
('SMP001', 'PRJ003', 'Budi & Sari Engagement', 'TEASER', 'Instagram', '2024-11-20', 'Teaser engagement session Budi & Sari ✨ #VenaPictures #EngagementSession', 'SCHEDULED', 'Post setelah client approve'),
('SMP002', 'PRJ001', 'Sarah & Ahmad Wedding', 'BTS', 'Instagram', '2024-12-22', 'Behind the scenes wedding Sarah & Ahmad 📸 #BehindTheScenes #WeddingPhotography', 'DRAFT', 'Tunggu hasil shooting'),
('SMP003', 'PRJ002', 'PT Teknologi Maju', 'PORTFOLIO', 'LinkedIn', '2024-12-26', 'Corporate event documentation for PT Teknologi Maju 🎯 #CorporatePhotography', 'DRAFT', 'Untuk LinkedIn company page');

-- Insert Contracts
INSERT INTO contracts (id, contract_number, client_id, project_id, signing_date, signing_location, client_name1, client_phone1, shooting_duration, guaranteed_photos, delivery_timeframe, dp_date, final_payment_date, jurisdiction) VALUES
('CTR001', 'VP-2024-001', 'CLI001', 'PRJ001', '2024-10-15', 'Office Vena Pictures', 'Sarah Melati', '+62812345678', '8 jam (full day)', 'Minimal 500 foto edited', '14 hari kerja setelah acara', '2024-10-20', '2024-12-25', 'Jakarta Selatan'),
('CTR002', 'VP-2024-002', 'CLI003', 'PRJ003', '2024-10-01', 'Cafe Meeting Point', 'Budi Santoso', '+62856789012', '3 jam (afternoon session)', 'Minimal 100 foto edited', '10 hari kerja setelah sesi', '2024-10-05', '2024-11-20', 'Jakarta Pusat');

-- Insert Client Feedback
INSERT INTO client_feedback (id, client_name, satisfaction, rating, feedback, date) VALUES
('FB001', 'Budi & Sari Engagement', 'SANGAT_PUAS', 5, 'Pelayanan sangat memuaskan, hasil foto engagement kami luar biasa! Tim Vena Pictures sangat profesional dan friendly. Highly recommended!', '2024-11-16'),
('FB002', 'Wedding Andi & Lisa', 'PUAS', 4, 'Overall bagus, cuma ada beberapa momen yang terlewat saat akad. Tapi hasil editing videonya keren banget!', '2024-10-30'),
('FB003', 'Corporate PT ABC', 'SANGAT_PUAS', 5, 'Dokumentasi event perusahaan sangat profesional. Hasilnya sesuai ekspektasi untuk keperluan marketing kami.', '2024-10-15');

-- Insert Notifications
INSERT INTO notifications (id, title, message, timestamp, icon, is_read) VALUES
('NOTIF001', 'Pembayaran DP Diterima', 'DP sebesar Rp 7.500.000 untuk project Wedding Sarah & Ahmad telah diterima', '2024-11-01 10:30:00', '💰', false),
('NOTIF002', 'Deadline Approaching', 'Project Engagement Budi & Sari akan deadline dalam 3 hari', '2024-11-12 09:00:00', '⏰', true),
('NOTIF003', 'New Lead', 'Lead baru dari Rina Wedding Inquiry melalui Instagram DM', '2024-11-10 14:15:00', '📩', false);

-- Insert Profile (singleton)
INSERT INTO profile (id, full_name, email, phone, company_name, website, address, bank_account, authorized_signer, bio, income_categories, expense_categories, project_types, event_types, asset_categories, sop_categories, project_status_config, notification_settings, security_settings, briefing_template, terms_and_conditions) VALUES
('profile-1', 'Vena Pictures Studio', 'info@venapictures.com', '+62213456789', 'CV Vena Pictures', 'https://venapictures.com', 'Jl. Fotografi No. 123, Jakarta Selatan', 'BCA 1234567890 a.n. CV Vena Pictures', 'Direktur Vena Pictures', 'Vena Pictures adalah studio fotografi dan videografi profesional yang berpengalaman dalam wedding, corporate, dan berbagai event dokumentasi.', 
'["DP Proyek", "Pelunasan Proyek", "Jasa Editing", "Sewa Equipment"]', 
'["Gaji Freelancer", "Equipment", "Transport", "Marketing", "Operational"]', 
'["Wedding", "Engagement", "Corporate", "Product", "Portrait", "Event"]', 
'["Meeting Klien", "Scouting Lokasi", "Training Team", "Maintenance Equipment"]', 
'["Kamera", "Lensa", "Lighting", "Audio", "Aksesoris", "Drone", "Computer"]', 
'["Wedding", "Corporate", "Equipment", "Post-Production", "Client Service"]',
'[{"id": "status_1", "name": "Tertunda", "color": "#64748b", "note": "Proyek belum dimulai", "subStatuses": []}, {"id": "status_2", "name": "Dalam Proses", "color": "#3b82f6", "note": "Proyek sedang berjalan", "subStatuses": [{"name": "Persiapan", "note": "Tahap planning dan persiapan"}, {"name": "Shooting", "note": "Tahap pelaksanaan shooting"}, {"name": "Editing", "note": "Tahap post-production"}]}, {"id": "status_3", "name": "Review Klien", "color": "#f59e0b", "note": "Menunggu feedback dari klien", "subStatuses": [{"name": "Preview Dikirim", "note": "Preview sudah dikirim ke klien"}, {"name": "Revisi", "note": "Sedang proses revisi"}]}, {"id": "status_4", "name": "Selesai", "color": "#10b981", "note": "Proyek sudah selesai", "subStatuses": []}]',
'{"newProject": true, "paymentConfirmation": true, "deadlineReminder": true}',
'{"twoFactorEnabled": false}',
'Halo Tim!\n\nProject baru telah masuk:\n- Klien: {clientName}\n- Tanggal: {projectDate}\n- Lokasi: {location}\n\nMohon persiapkan equipment dan konfirmasi kehadiran.\n\nTerima kasih!',
'1. Pembayaran DP minimal 50% sebelum hari H\n2. Pelunasan maksimal H+7 setelah delivery\n3. Hasil foto/video menjadi hak cipta Vena Pictures\n4. Klien berhak mendapat soft copy semua hasil\n5. Revisi maksimal 2x untuk editing\n6. Force majeure tidak dapat diklaim\n7. Pembatalan H-7 dikenakan biaya 25%');
