from unittest import TestCase
from app.models import Group as BaseGroup
from app.models import Project as BaseProject
from app.models.storable_model import FieldRequired, ParentCycle, ChildAlreadyExists, ParentAlreadyExists

TEST_COLLECTION = "tgroup"


class Project(BaseProject):
    _collection = "tproject"


class Group(BaseGroup):
    _collection = TEST_COLLECTION
    _project_class = Project


class TestGroupModel(TestCase):

    @classmethod
    def setUpClass(cls):
        Project.destroy_all()
        Group.destroy_all()
        Project.ensure_indexes()
        Group.ensure_indexes()
        cls.tproject = Project(name="test_project")
        cls.tproject.save()

    def setUp(self):
        Group.destroy_all()

    def tearDown(self):
        Group.destroy_all()

    @classmethod
    def tearDownClass(cls):
        from library.db import db
        db.conn[TEST_COLLECTION].drop()

    def test_incomplete(self):
        from app.models.group import InvalidProjectId
        group = Group()
        self.assertRaises(FieldRequired, group.save)
        group.name = "my test group"
        group.project_id = "some invalid id"
        self.assertRaises(InvalidProjectId, group.save)

    def test_children_before_save(self):
        from app.models.storable_model import ObjectSaveRequired
        g1 = Group(name="g1")
        g2 = Group(name="g2")
        self.assertRaises(ObjectSaveRequired, g1.add_child, g2)
        self.assertRaises(ObjectSaveRequired, g2.add_parent, g1)

    def test_self_parent(self):
        g1 = Group(name="g1", project_id=self.tproject._id)
        g1.save()
        self.assertRaises(ParentCycle, g1.add_parent, g1)

    def test_self_child(self):
        g1 = Group(name="g1", project_id=self.tproject._id)
        g1.save()
        self.assertRaises(ParentCycle, g1.add_child, g1)

    def test_child_already_exists(self):
        g1 = Group(name="g1", project_id=self.tproject._id)
        g1.save()
        g2 = Group(name="g2", project_id=self.tproject._id)
        g2.save()
        g1.add_child(g2)
        self.assertRaises(ChildAlreadyExists, g1.add_child, g2)

    def test_parent_already_exists(self):
        g1 = Group(name="g1", project_id=self.tproject._id)
        g1.save()
        g2 = Group(name="g2", project_id=self.tproject._id)
        g2.save()
        g1.add_parent(g2)
        self.assertRaises(ParentAlreadyExists, g1.add_parent, g2)

    def test_cycle(self):
        g1 = Group(name="g1", project_id=self.tproject._id)
        g1.save()
        g2 = Group(name="g2", project_id=self.tproject._id)
        g2.save()
        g3 = Group(name="g3", project_id=self.tproject._id)
        g3.save()
        g4 = Group(name="g4", project_id=self.tproject._id)
        g4.save()
        g1.add_child(g2)
        g2.add_child(g3)
        g3.add_child(g4)
        self.assertRaises(ParentCycle, g4.add_child, g1)
        self.assertRaises(ParentCycle, g1.add_parent, g4)

    def test_add_child_by(self):
        g1 = Group(name="g1", project_id=self.tproject._id)
        g1.save()
        g2 = Group(name="g2", project_id=self.tproject._id)
        g2.save()

        g1.add_child(g2)
        tg = Group.find_one({ "name": "g1" })
        self.assertIn(g2._id, tg.child_ids)
        g1.remove_child(g2)

        g1.add_child(g2._id)
        tg = Group.find_one({ "name": "g1" })
        self.assertIn(g2._id, tg.child_ids)
        g1.remove_child(g2._id)

        g1.add_child(str(g2._id))
        tg = Group.find_one({ "name": "g1" })
        self.assertIn(g2._id, tg.child_ids)
        g1.remove_child(str(g2._id))

