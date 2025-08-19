"""
Revision ID: 0001_initial
Revises: None
Create Date: 2025-08-17
"""

revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Example: create initial tables
    pass

def downgrade():
    # Example: drop initial tables
    pass
