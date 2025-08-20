"""
Merge heads 0005_merge_heads and 0006_tool_usage_req_cleaned into a single branch
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0007_final_merge'
down_revision = ('0005_merge_heads', '0006_tool_usage_req_cleaned')
branch_labels = None
depends_on = None

def upgrade():
    pass

def downgrade():
    pass
