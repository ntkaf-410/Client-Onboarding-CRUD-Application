export const TITLES = [
  { value: 'Mr', label: 'Mr' },
  { value: 'Mrs', label: 'Mrs' },
  { value: 'Ms', label: 'Ms' },
  { value: 'Miss', label: 'Miss' },
  { value: 'Dr', label: 'Dr' },
  { value: 'Prof', label: 'Prof' },
] as const;
export type Title = (typeof TITLES)[number]['value'];

export const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
] as const;
export type Gender = (typeof GENDERS)[number]['value'];

export const MARITAL_STATUSES = [
  { value: 'SINGLE', label: 'Single' },
  { value: 'MARRIED', label: 'Married' },
  { value: 'DIVORCED', label: 'Divorced' },
  { value: 'WIDOWED', label: 'Widowed' },
] as const;
export type MaritalStatus = (typeof MARITAL_STATUSES)[number]['value'];

export const ID_TYPES = [
  { value: 'NATIONAL_ID', label: 'National ID' },
  { value: 'PASSPORT', label: 'Passport' },
  { value: 'DRIVERS_LICENCE', label: "Driver's licence" },
] as const;
export type IdType = (typeof ID_TYPES)[number]['value'];

export const EMPLOYMENT_STATUSES = [
  { value: 'EMPLOYED', label: 'Employed' },
  { value: 'SELF_EMPLOYED', label: 'Self-employed' },
  { value: 'UNEMPLOYED', label: 'Unemployed' },
  { value: 'STUDENT', label: 'Student' },
  { value: 'RETIRED', label: 'Retired' },
] as const;
export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number]['value'];

export const RESIDENTIAL_STATUSES = [
  { value: 'OWNER', label: 'Owner' },
  { value: 'RENTING', label: 'Renting' },
  { value: 'FAMILY', label: 'Living with family' },
  { value: 'OTHER', label: 'Other' },
] as const;
export type ResidentialStatus = (typeof RESIDENTIAL_STATUSES)[number]['value'];

export const ONBOARDING_STATUSES = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SUBMITTED', label: 'Submitted' },
] as const;

export const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina',
   'Armenia', 'Australia', 'Austria', 'Azerbaijan' ,
'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
 'Congo (Congo-Brazzaville)', 'Costa Rica', 'Côte d Ivoire', 'Croatia', 'Cuba', 'Cyprus', 'Czechia (Czech Republic)',
'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia','Fiji', 'Finland', 'France',
'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana' ,
'Haiti', 'Holy See', 'Honduras', 'Hungary',
'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy' ,'Jamaica', 'Japan', 'Jordan',
'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan','Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
'Liechtenstein', 'Lithuania', 'Luxembourg','Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
'Oman','Pakistan', 'Palau', 'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal' ,
'Qatar','Romania', 'Russia', 'Rwanda','Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 
'Vanuatu', 'Venezuela', 'Vietnam','Yemen'
] as const;