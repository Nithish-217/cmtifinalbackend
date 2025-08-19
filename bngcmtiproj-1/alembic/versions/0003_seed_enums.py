"""
Revision ID: 0003_seed_enums
Revises: 0002_add_indexes
Create Date: 2025-08-17
"""

revision = '0003_seed_enums'
down_revision = '0002_add_indexes'
branch_labels = None
depends_on = None
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Example: create enum tables or seed enum values
    pass

def downgrade():
    # Example: drop enum tables or remove seeded values
    pass
