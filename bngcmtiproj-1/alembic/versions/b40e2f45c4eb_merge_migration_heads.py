"""Merge migration heads

Revision ID: b40e2f45c4eb
Revises: 0004_add_tool_fields, 3adb2e84bd6a
Create Date: 2025-08-17 12:35:38.416801

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b40e2f45c4eb'
down_revision = ('0004_add_tool_fields', '3adb2e84bd6a')
branch_labels = None
depends_on = None

def upgrade():
	pass

def downgrade():
	pass
