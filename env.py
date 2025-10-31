import os

os.environ.setdefault("DATABASE_URL", "postgresql://neondb_owner:npg_Pm3NSVFCe2wh@ep-sweet-base-agt6oy84.c-2.eu-central-1.aws.neon.tech/pouch_cling_olive_753038"), # For the database security details.
os.environ.setdefault("SECRET_KEY", "9a2d0cb1e6284af0da6c4b44dfde76f3c3e9ccbaea964d5a27"),
os.environ.setdefault("DEBUG", "True") # Means that Debug mode will NEVER get used in production.