"""
Revision ID: 0004_add_tool_fields
Revises: 0003_seed_enums
Create Date: 2025-08-17
"""

revision = '0004_add_tool_fields'
down_revision = '0003_seed_enums'
branch_labels = None
depends_on = None
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column('tool_inventory', sa.Column('range_mm', sa.String(100), nullable=True))
    op.add_column('tool_inventory', sa.Column('identification_code', sa.String(100), nullable=True))
    op.add_column('tool_inventory', sa.Column('make', sa.String(100), nullable=True))
    op.add_column('tool_inventory', sa.Column('location', sa.String(100), nullable=True))
    op.add_column('tool_inventory', sa.Column('gauge', sa.String(100), nullable=True))
    op.add_column('tool_inventory', sa.Column('remarks', sa.String(255), nullable=True))

def downgrade():
    op.drop_column('tool_inventory', 'remarks')
    op.drop_column('tool_inventory', 'gauge')
    op.drop_column('tool_inventory', 'location')
    op.drop_column('tool_inventory', 'make')
    op.drop_column('tool_inventory', 'identification_code')
    op.drop_column('tool_inventory', 'range_mm')
