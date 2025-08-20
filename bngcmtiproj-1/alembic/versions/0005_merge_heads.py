"""
Merge multiple Alembic heads into a single branch
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0005_merge_heads'
down_revision = ('0004_add_tool_usage_request_columns', '0004_tool_usage_req_cols', 'b40e2f45c4eb')
branch_labels = None
depends_on = None

def upgrade():
    pass

def downgrade():
    pass
