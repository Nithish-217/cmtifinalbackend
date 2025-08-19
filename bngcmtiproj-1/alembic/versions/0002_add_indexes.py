"""
Revision ID: 0002_add_indexes
Revises: 0001_initial
Create Date: 2025-08-17
"""

revision = '0002_add_indexes'
down_revision = '0001_initial'
branch_labels = None
depends_on = None
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Example: add indexes or constraints
    pass

def downgrade():
    # Example: remove indexes or constraints
    pass
