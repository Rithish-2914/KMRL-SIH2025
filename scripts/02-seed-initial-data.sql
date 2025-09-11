-- Seed initial data for KMRL Smart Document Assistant

-- Insert departments
INSERT INTO departments (id, name, malayalam_name, code, description) VALUES
(uuid_generate_v4(), 'Human Resources', 'മാനവ വിഭവശേഷി', 'HR', 'Human Resources and Administration'),
(uuid_generate_v4(), 'Engineering', 'എഞ്ചിനീയറിംഗ്', 'ENG', 'Engineering and Technical Operations'),
(uuid_generate_v4(), 'Safety & Security', 'സുരക്ഷ', 'SAFETY', 'Safety and Security Department'),
(uuid_generate_v4(), 'Operations', 'പ്രവർത്തനങ്ങൾ', 'OPS', 'Metro Operations and Maintenance'),
(uuid_generate_v4(), 'Finance', 'ധനകാര്യം', 'FIN', 'Finance and Accounts'),
(uuid_generate_v4(), 'Legal & Regulatory', 'നിയമ വിഭാഗം', 'LEGAL', 'Legal and Regulatory Affairs'),
(uuid_generate_v4(), 'IT & Digital', 'ഐടി വിഭാഗം', 'IT', 'Information Technology and Digital Services');

-- Insert document categories
INSERT INTO document_categories (id, name, malayalam_name, code, description) VALUES
(uuid_generate_v4(), 'Policy Documents', 'നയ രേഖകൾ', 'POLICY', 'Official policies and procedures'),
(uuid_generate_v4(), 'Safety Reports', 'സുരക്ഷാ റിപ്പോർട്ടുകൾ', 'SAFETY_RPT', 'Safety incident reports and analysis'),
(uuid_generate_v4(), 'Technical Specifications', 'സാങ്കേതിക വിവരണങ്ങൾ', 'TECH_SPEC', 'Technical documents and specifications'),
(uuid_generate_v4(), 'Financial Reports', 'സാമ്പത്തിക റിപ്പോർട്ടുകൾ', 'FIN_RPT', 'Financial statements and reports'),
(uuid_generate_v4(), 'Regulatory Compliance', 'നിയന്ത്രണ അനുസരണം', 'COMPLIANCE', 'Regulatory and compliance documents'),
(uuid_generate_v4(), 'Employee Records', 'ജീവനക്കാരുടെ രേഖകൾ', 'EMP_REC', 'Employee documentation and records'),
(uuid_generate_v4(), 'Maintenance Logs', 'അറ്റകുറ്റപ്പണി രേഖകൾ', 'MAINT_LOG', 'Equipment maintenance and service logs'),
(uuid_generate_v4(), 'Correspondence', 'കത്തിടപാടുകൾ', 'CORRESP', 'Official correspondence and communications');

-- Insert sample users
INSERT INTO users (id, email, name, malayalam_name, phone, role, department_id, preferred_language) VALUES
(uuid_generate_v4(), 'admin@kmrl.gov.in', 'System Administrator', 'സിസ്റ്റം അഡ്മിനിസ്ട്രേറ്റർ', '+91-9876543210', 'admin', (SELECT id FROM departments WHERE code = 'IT'), 'en'),
(uuid_generate_v4(), 'hr.head@kmrl.gov.in', 'HR Manager', 'എച്ച്ആർ മാനേജർ', '+91-9876543211', 'manager', (SELECT id FROM departments WHERE code = 'HR'), 'ml'),
(uuid_generate_v4(), 'safety.officer@kmrl.gov.in', 'Safety Officer', 'സുരക്ഷാ ഓഫീസർ', '+91-9876543212', 'officer', (SELECT id FROM departments WHERE code = 'SAFETY'), 'en'),
(uuid_generate_v4(), 'eng.head@kmrl.gov.in', 'Chief Engineer', 'ചീഫ് എഞ്ചിനീയർ', '+91-9876543213', 'manager', (SELECT id FROM departments WHERE code = 'ENG'), 'en'),
(uuid_generate_v4(), 'ops.manager@kmrl.gov.in', 'Operations Manager', 'ഓപ്പറേഷൻസ് മാനേജർ', '+91-9876543214', 'manager', (SELECT id FROM departments WHERE code = 'OPS'), 'ml');

-- Update department heads
UPDATE departments SET head_user_id = (SELECT id FROM users WHERE email = 'hr.head@kmrl.gov.in') WHERE code = 'HR';
UPDATE departments SET head_user_id = (SELECT id FROM users WHERE email = 'eng.head@kmrl.gov.in') WHERE code = 'ENG';
UPDATE departments SET head_user_id = (SELECT id FROM users WHERE email = 'ops.manager@kmrl.gov.in') WHERE code = 'OPS';
UPDATE departments SET head_user_id = (SELECT id FROM users WHERE email = 'safety.officer@kmrl.gov.in') WHERE code = 'SAFETY';
