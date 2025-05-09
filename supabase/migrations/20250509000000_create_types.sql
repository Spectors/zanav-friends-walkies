
-- Create user role enum
CREATE TYPE user_role AS ENUM ('owner', 'giver');

-- Create pet species enum
CREATE TYPE pet_species AS ENUM ('dog', 'cat');

-- Create service type enum
CREATE TYPE service_type AS ENUM ('walk', 'grooming', 'boarding', 'training');

-- Create service request status enum
CREATE TYPE request_status AS ENUM ('open', 'matched', 'in_progress', 'completed', 'cancelled');

-- Create service offer status enum
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected');

-- Create service status enum
CREATE TYPE service_status AS ENUM ('in_progress', 'completed', 'cancelled');

-- Create verification status enum
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
