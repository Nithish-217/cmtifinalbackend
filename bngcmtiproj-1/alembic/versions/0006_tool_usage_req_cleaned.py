"""
Cleaned migration: Only add missing columns to tool_usage_requests table
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0006_tool_usage_req_cleaned'
down_revision = ('0004_add_tool_usage_request_columns', '0004_tool_usage_req_cols', 'b40e2f45c4eb')
branch_labels = None
depends_on = None

def upgrade():
    # Only add columns if they do not exist
    with op.get_context().autocommit_block():
        conn = op.get_bind()
        table = 'tool_usage_requests'
        columns = [row[0] for row in conn.execute(sa.text(f"SELECT column_name FROM information_schema.columns WHERE table_name='{table}'")).fetchall()]
        if 'reviewed_at' not in columns:
            op.add_column(table, sa.Column('reviewed_at', sa.DateTime(timezone=True), nullable=True))
        if 'reviewer_id' not in columns:
            op.add_column(table, sa.Column('reviewer_id', sa.Integer, nullable=True))
        if 'reviewer_remarks' not in columns:
            op.add_column(table, sa.Column('reviewer_remarks', sa.String(255), nullable=True))

def downgrade():
    op.drop_column('tool_usage_requests', 'reviewed_at')
    op.drop_column('tool_usage_requests', 'reviewer_id')
    op.drop_column('tool_usage_requests', 'reviewer_remarks')
