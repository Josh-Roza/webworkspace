from django.db import models

class Monster(models.Model):
    name = models.CharField(max_length=100)
    HP = models.IntegerField()
    AC = models.IntegerField()
    CR = models.CharField(max_length=10)
    XP = models.CharField(max_length=10, default="100")
    speed = models.CharField(max_length=300)
    stats = models.CharField(max_length=100)
    skills = models.TextField()
    attributes = models.TextField()
    actions = models.TextField()
    legendaryActions = models.TextField()
    rangedAttack = models.BooleanField(default=False)
    pack = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.name}, CR:{self.CR} XP: {self.XP}'

class Scenario(models.Model):
    name = models.CharField(max_length=200, blank=True)
    CR = models.CharField(max_length=50, blank=True)
    XP = models.IntegerField(null=True, blank=True)
    Monsters = models.ManyToManyField(Monster, blank=True)
    data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
