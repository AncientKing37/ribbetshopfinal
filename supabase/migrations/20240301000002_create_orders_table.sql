-- Create enum for order status
CREATE TYPE order_status AS ENUM (
  'pending',      -- Initial state when order is created
  'processing',   -- Being processed by system
  'completed',    -- Successfully delivered
  'failed',       -- Failed to deliver
  'cancelled'     -- Cancelled by user or system
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_intent_id TEXT,
  payment_status TEXT,
  metadata JSONB,
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  processed_by TEXT,                -- System identifier that processed the order
  items JSONB NOT NULL
);

-- Add indexes for common queries
CREATE INDEX orders_user_id_idx ON orders(user_id);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_created_at_idx ON orders(created_at);

-- Add RLS policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only allow system service account to update orders
CREATE POLICY "Only system service account can update orders"
  ON orders FOR UPDATE
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'service@example.com'
  ));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add order_id to purchases table for reference
ALTER TABLE purchases
ADD COLUMN order_id UUID REFERENCES orders(id),
ADD COLUMN status order_status DEFAULT 'completed';

-- Update types
COMMENT ON TABLE orders IS 'Stores order information for processing';
COMMENT ON COLUMN orders.id IS 'Unique identifier for the order';
COMMENT ON COLUMN orders.user_id IS 'Reference to the user who placed the order';
COMMENT ON COLUMN orders.status IS 'Current status of the order';
COMMENT ON COLUMN orders.created_at IS 'Timestamp when order was created';
COMMENT ON COLUMN orders.updated_at IS 'Timestamp when order was last updated';
COMMENT ON COLUMN orders.completed_at IS 'Timestamp when order was completed';
COMMENT ON COLUMN orders.amount IS 'Total amount of the order';
COMMENT ON COLUMN orders.currency IS 'Currency of the order amount';
COMMENT ON COLUMN orders.payment_intent_id IS 'Payment provider reference ID';
COMMENT ON COLUMN orders.payment_status IS 'Status of payment from provider';
COMMENT ON COLUMN orders.metadata IS 'Additional order metadata';
COMMENT ON COLUMN orders.error_message IS 'Error message if order processing failed';
COMMENT ON COLUMN orders.processed_at IS 'Timestamp when order was processed';
COMMENT ON COLUMN orders.processed_by IS 'System identifier';
COMMENT ON COLUMN orders.items IS 'JSON array of ordered items'; 