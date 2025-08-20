"""
Add missing columns to tool_usage_requests table
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0004_add_tool_usage_request_columns'
down_revision = '0003_seed_enums'
branch_labels = None
depends_on = None

def upgrade():
    # Add columns only if they do not exist
    conn = op.get_bind()
    table_name = 'tool_usage_requests'
    columns = [
        ('request_id', "ALTER TABLE tool_usage_requests ADD COLUMN request_id VARCHAR(64) NOT NULL"),
        ('reviewed_at', "ALTER TABLE tool_usage_requests ADD COLUMN reviewed_at TIMESTAMP WITH TIME ZONE"),
        ('reviewer_id', "ALTER TABLE tool_usage_requests ADD COLUMN reviewer_id INTEGER"),
        ('reviewer_remarks', "ALTER TABLE tool_usage_requests ADD COLUMN reviewer_remarks VARCHAR(255)")
    ]
    import sqlalchemy as sa
    for col, sql in columns:
        result = conn.execute(sa.text(f"SELECT column_name FROM information_schema.columns WHERE table_name='{table_name}' AND column_name='{col}'"))
        if not result.fetchone():
            conn.execute(sa.text(sql))

def downgrade():
    op.drop_column('tool_usage_requests', 'request_id')
    op.drop_column('tool_usage_requests', 'reviewed_at')
    op.drop_column('tool_usage_requests', 'reviewer_id')
    op.drop_column('tool_usage_requests', 'reviewer_remarks')
